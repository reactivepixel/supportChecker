// Msg model for database interactions
var Question = require('../models/question.js');

const commandWord = 'assisted';

var default_message = {
	name: 'support',
	events: function(controller, bot) {

		// // Listen for command 'check' to be addressed to the bot
		controller.hears(['(' + commandWord + ' <.*> [A-Za-z0-9_\s].*|' + commandWord + ')'], ['direct_message', 'direct_mention'], function(bot, message) {
				var heard = message.match[0].split(' ');

				// If the Reg format for check was
				if(heard.length === 1){
					bot.startPrivateConversation(message,function(err,dm) {
						dm.say('Please use the format \`' + commandWord +' @userName topic\`');
					});
				} else {

					var recombineTopic = '';

					// Skip first 2 entries
					for(var index = 2; index < heard.length; index++){
						recombineTopic += heard[index] + ' ';
					}
					// reusable check object map
					var cleanTargetUserName = heard[1].substr(2, (heard[1].length - 3)); // clean <@ > off of the target user name

					var check = {
						initiatingUser: message.user,
						unformattedTargetUser: cleanTargetUserName,
						formattedTargetUser: heard[1],
						response: '',
						ts: message.ts,
						topic: recombineTopic,
						text: message.text,
						outcome: 'Pending', // ENUM 'Closed', 'Pending'
					}



						// If no matches



								// Notify Initiating User
								bot.startPrivateConversation(message,function(err,dm) {
							    dm.say('I have recorded that ' + check.formattedTargetUser + ' was assisted with ' + check.topic);
									dm.say('Thanks! :beers:');
							  });

								console.log('** Sending new message to target Student');
								bot.startPrivateConversation({user: check.unformattedTargetUser}, askFeedback);

								function askFeedback(response, convo){

									// Save response to DB
									var questionInfo = {
										channel: message.channel,
										source_team: message.source_team,
										studentSlackUser: cleanTargetUserName,
										staffSlackUser: message.user,
										topic: recombineTopic,
										ts: message.ts,
									}

									Question.create(questionInfo, console.error, (initQuestionData) => {
										convo.ask('Hello! I see that <@' + check.initiatingUser + '> helped you with an issue. Was this a :+1: or :-1: experience? Please reply with a comment to confirm :smiley:', (questionResponse, convo) => {

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
												convo.say(':thinking_face: Hrmm... Unfortunatly I was not able to detect a :thumbsup: or :thumbsdown: in your comment (note: I\'m not smart enough to recognize reactions, only comments). Could you please respond with either `:thumbsup:` for a positive expereince or with a `:thumbsdown:` to indicate you had a negative experience. This will allow us to better assist you moving forward with this issue. Let\'s try again.')
												askFeedback(questionResponse, convo);
											}

											convo.next();
										});
									});
								}

								// function unrecognizedResponse(response, convo){
								// 	convo.ask(':thinking_face: Hrmm... Unfortunatly I was not able to detect a :thumbsup: or :thumbsdown: in your comment (note: I\'m not smart enough to recognize reactions, only comments). Could you please respond with either `:thumbsup:` for a positive expereince or with a `:thumbsdown:` to indicate you had a negative experience. This will allow us to better assist you moving forward with this issue. Let\'s try again.', (unrecognizedRes, convo) => {
								//
								// 		askFeedback(unrecognizedRes, convo);
								// 		convo.next();
								// 	});
								// }

								function negativeFeedbackFollowup(response, convo, questionInfo){
									convo.ask('Sorry to hear that :cold_sweat::face_with_head_bandage:. We will look into this further. Could you explain what the problem is in a single message? My capabilities have been limited; for humanity\'s protection.', (negResponse, convo) => {
										convo.say('I will notate this and pass it along. Thanks for your honest feedback. Again, sorry for this poor experience. We will work to improve it. Please give us a day to try and clear things up. In the meantime try reaching out to the related public slack channels to help address your issue if it is technical in nature. If your issue is personal in nature or you feel uncomfortable discussing this further with a whom first initiated this contact please reach out to your Course Director or Department Chair directly through Slack and/or Email.')

										// Save response to DB
										questionInfo.studentResponse = negResponse.text
										Question.setandClosePositive(questionInfo);

										convo.next();
									});
								}





				}


		});

		//
		// 	// Post in heard channel that the reply will be private
		// 	bot.reply(message, 'Recalling previous messages from this channel. Check your DMs :mailbox_with_mail:');
		//
		// 	// Split the matched heard message to use the number they added
		// 	var heard = message.match[0].split(' ');
		//
		// 	// Set the limit = the number the user entered or if none was entered default to 10
		// 	var limit = Number(heard[1]) || 10;
		//
		// 	// Recall from the Model
		// 	Msg.recall({
		// 		channel: message.channel,
		// 		limit: limit
		// 	}, function(docs) {
		//
		// 		// Initiate a DM conversation with the author of the heard message
		// 		bot.startPrivateConversation(message, function(err, dm) {
		//
		// 			// Wrapping a channel id or user id string with it's corrosponding symbol and <>'s
		// 			// tell slack to parse the acual user / channel object
		// 			var combinedMsg = '> <#' + docs[0].channel + '>\'s last ' + docs.length + ' messages. (newest first)\n\n';
		//
		// 			// Loop all recalled messages
		// 			for (var docIndex in docs) {
		// 				var doc = docs[docIndex];
		//
		// 				// Add onto the initial message so as not to spam the user with multiple DMs
		// 				combinedMsg += '<@' + doc.user + '>: ' + doc.text + '\n';
		// 			}
		//
		// 			// Send the DM
		// 			dm.say(combinedMsg);
		// 		});
		// 	}, function(err) {
		// 		console.log('err' + err);
		// 	});
		// });

	}
}

module.exports = default_message;
