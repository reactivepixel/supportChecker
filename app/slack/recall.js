var default_message = {
	name: 'recall',
	events: function(controller, bot) {

		// Msg model for database interactions
		var Msg = require('../../models/msg.js');

		// Every to any incoming message
		controller.on(['ambient', 'direct_message', 'direct_mention', 'mention'], function(bot, message) {

			Msg.find(message, (matchErr) => {
				console.error('Duplicate Error', matchErr);
			}, (matchedMessage) => {
				// Hand the message obj to the Msg model for it to be added to the database.
				// Define Success and Failure Handling
				if(matchedMessage.length === 0){
					Msg.create(message, (saveError) => {
						console.error('Error Saving Msg', saveError);
					}, (savedMsg) => {
						console.log('Saved Msg', savedMsg.dataValues.id);
					});
				} else {
					console.log('Duplicate mesage identified, skipping save', matchedMessage[0].dataValues.id);
				}
			});


		});

		// // Listen for command 'recall' to be addressed to the bot
		// controller.hears(['recall .*[0-9]', 'recall'], ['direct_message', 'direct_mention'], function(bot, message) {
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
