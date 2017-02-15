if (!process.env.REALTIME_SLACK_TOKEN) {
	console.error('Error: Specify REALTIME_SLACK_TOKEN in environment');
	process.exit();
};


var http = require('http');
var db = require('../models/db');

// Sync DB then start services
db.sequelize.sync().then(() => {
		console.log('Database Synced. Loading Bot');
		var slack = require('./slack'); //	Initialize Slack controller
});
