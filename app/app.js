if (!process.env.REALTIME_SLACK_TOKEN) {
	console.error('Error: Specify REALTIME_SLACK_TOKEN in environment');
	process.exit();
};

var slack = require('./slack'); //	Initialize Slack controller

var http = require('http');
var db = require('../models/db');

// Sync DB then start services
db.sequelize.sync().then(() => {
	setInterval(function herokukeepalive() { //	Ping Heroku every 10 minutes (600000ms)
		console.log('** Keepalive ping');
		http.get(process.env.KEEPALIVE_ENDPOINT);
	}, 600000);
});
