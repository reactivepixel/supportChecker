// Msg model for database interactions
var Question = require('../../models/question.js');

const commandWord = 'assisted';

var default_message = {
	name: 'support',
	events: (controller, bot) => {

		controller.hears(['assists <.*>'], ['direct_message', 'direct_mention'], (bot, message) => {
			const heard = message.match[0].split(' ');
			const targetStudentSlackUser = parseUserIDFromSlack(heard[1]);

				bot.startPrivateConversation(message, (res, dm) => {
					var serverLink = 'http://localhost:3100'
					dm.say('`JSON` Student: ' + heard[1] + ' ' + serverLink + '/api/assists/received/' + targetStudentSlackUser)
				});
		});
		// Listen for command 'check' to be addressed to the bot
		controller.hears(['(' + commandWord + ' <.*> [A-Za-z0-9_\s].*|' + commandWord + ')'], ['direct_message', 'direct_mention'], (bot, message) => {
				const heard = message.match[0].split(' ');

				const targetUserName = parseUserIDFromSlack(heard[1]);
				const topic = formatTopic(heard);

				// If the Reg format for check was
				if(heard.length === 1){
					bot.startPrivateConversation(message, (res, dm) => {
						dm.say('Please use the format \`' + commandWord +' @userName topic\`');
					});
				} else {

					const askFeedback = (response, convo) => {

						// Save response to DB
						var questionInfo = {
							channel: message.channel,
							source_team: message.source_team,
							studentSlackUser: targetUserName,
							staffSlackUser: message.user,
							topic: topic,
							ts: message.ts,
						}

						Question.create(questionInfo, console.error, (initQuestionData) => {
							convo.ask('Hello! I see that ' + formatUserIDForSlackOutput(targetUserName) + ' ' +
												'helped you with an issue. Was this a :+1: or :-1: experience? ' +
												'Please reply with a comment to confirm :smiley:', (questionResponse, convo) => {

								questionInfo.id = initQuestionData.id

								// Positive Response
								if(questionResponse.text.match('thumbsup_all|thumbsup|\\+1')){

									convo.say('Thanks for the feedback! :wink:');


									questionInfo.studentResponse = questionResponse.text
									Question.setandClosePositive(questionInfo);
								// Negative Response
								} else if (questionResponse.text.match('thumbsdown|\\-1')){

									negativeFeedbackFollowup(questionResponse, convo, questionInfo);
									Question.setNegative(questionInfo);
								// unrecognized response
								} else {

									// Delete current question to avoid duplicates on restart of question cycle.
									Question.destroy(questionInfo, console.error, console.log);
									convo.say(':thinking_face: Hrmm... Unfortunatly I was not able to detect a ' +
														':thumbsup: or :thumbsdown: in your comment (note: I\'m not smart enough ' +
														'to recognize reactions, only comments). Could you please respond with either ' +
														'`:thumbsup:` for a positive experience or with a `:thumbsdown:` to indicate ' +
														'you had a negative experience. This will allow us to better assist you moving ' +
														'forward with this issue. Let\'s try again.')
									askFeedback(questionResponse, convo);
								}

								convo.next();
							});
						});
					}

					const negativeFeedbackFollowup = (response, convo, questionInfo) => {
						convo.ask('Sorry to hear that :cold_sweat::face_with_head_bandage:. ' +
											'We will look into this further. Could you explain what the problem is in a ' +
											'single message? My capabilities have been limited; for humanity\'s protection.', (negResponse, convo) => {

							convo.say('I will notate this and pass it along. Thanks for your honest feedback. ' +
												'Again, sorry for this poor experience. We will work to improve it. ' +
												'Please give us a day to try and clear things up. ' +
												'In the meantime try reaching out to the related public slack channels ' +
												'to help address your issue if it is technical in nature. If your issue ' +
												'is personal in nature or you feel uncomfortable discussing this further ' +
												'with a whom first initiated this contact please reach out to your ' +
												'Course Director or Department Chair directly through Slack and/or Email.')

							// Save response to DB
							questionInfo.studentResponse = negResponse.text
							Question.setandClosePositive(questionInfo);

							convo.next();
						});
					}

					// Staff Conversation
					bot.startPrivateConversation(message, (res, dm) => {
				    dm.say(	'I have recorded that ' + formatUserIDForSlackOutput(targetUserName) + ' ' +
										'was assisted with ' + topic + ' ' +
										'Thanks! :beers:');
				  });

					// Student Conversation
					bot.startPrivateConversation({user: targetUserName}, askFeedback);
				}
		});
	}
}

const formatTopic = (inputAry) => {

	// ignore first two enties (command and target user) and join the rest
	var tempAry = inputAry.slice(2, inputAry.length);
	return tempAry.join(' ');
}

const determineContext = (inputStr) => {
	if (inputStr.match('thumbsup_all|thumbsup|\\+1')) {
		return true;
	} else if (inputStr.match('thumbsdown|\\-1')) {
		return false;
	} else {
		return -1;
	}
}

const formatUserIDForSlackOutput = (id) => {
	return '<@' + id + '>';
}

const parseUserIDFromSlack = (formattedID) => {
	// clean <@ > off of the target user name
	return formattedID.substr(2, (formattedID.length - 3));
}



module.exports = default_message;
