const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URI, {
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});

const msg = sequelize.define('msg', {
  type: {
    type: Sequelize.STRING,
  },
  channel: {
    type: Sequelize.STRING,
  },
  user: {
    type: Sequelize.STRING,
  },
  text: {
    type: Sequelize.STRING,
  },
  ts: {
    type: Sequelize.STRING,
  },
  source_team: {
    type: Sequelize.STRING,
  },
  event: {
    type: Sequelize.STRING,
  }
});


const question = sequelize.define('question', {
  channel: {
    type: Sequelize.STRING,
  },
  staffSlackUser: {
    type: Sequelize.STRING,
  },
  studentSlackUser: {
    type: Sequelize.STRING,
  },
  topic: {
    type: Sequelize.STRING,
  },
  studentResponse: {
    type: Sequelize.TEXT,
  },
  ts: {
    type: Sequelize.STRING,
  },
  source_team: {
    type: Sequelize.STRING,
  },
  positiveInteraction: {
    type: Sequelize.BOOLEAN,
  },
  resolved: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

exports.sequelize = sequelize;
exports.msg = msg;
exports.question = question;
