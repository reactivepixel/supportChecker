// Msg model for database interactions
var Check = require('../models/check.js');

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

					// Determine if other identical checks are in the system (timestamps included)
					Check.find(check, (matchErr) => {
						console.error('Duplicate Check Error', matchErr);
					}, (matchedCheck) => {

						// If no matches
						if(matchedCheck.length === 0){

							// Add check to the DB
							Check.create(check, (saveError) => {
								console.error('Error Saving Check', saveError);
							}, (savedCheck) => {
								console.log('Saved Check', savedCheck.dataValues.id);

								// Notify Initiating User
								bot.startPrivateConversation(message,function(err,dm) {
							    dm.say('I have recorded that ' + check.formattedTargetUser + ' was assisted with ' + check.topic);
									dm.say('Thanks! :beers:');
							  });

								tempMsg = message;
								tempMsg.user = check.unformattedTargetUser

								console.log('** Sending new message to target Student');
								bot.startPrivateConversation(tempMsg,function(err,dm) {
							    dm.say('Hello! I see that <@' + check.initiatingUser + '> helped you address an issue.');
									dm.say('Was this a :+1: or :-1: experience?');
							  });
							});

						// If a match is found
						} else {

							// Likely ambiant duplication request from RTM
							console.log('Duplicate Check identified, skipping save', matchedCheck[0].dataValues);
						}
					});



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
