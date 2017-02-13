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

const check = sequelize.define('check', {
  initiatingUser: {
    type: Sequelize.STRING,
  },
  unformattedTargetUser: {
    type: Sequelize.STRING,
  },
  formattedTargetUser: {
    type: Sequelize.STRING,
  },
  response: {
    type: Sequelize.TEXT,
  },
  topic: {
    type: Sequelize.STRING,
  },
  outcome: {
    type: Sequelize.ENUM('Closed', 'Pending'),
    defaultValue: 'Pending',
  },
  text: {
    type: Sequelize.STRING,
  },
  ts: {
    type: Sequelize.STRING,
  },
});
exports.sequelize = sequelize;
exports.msg = msg;
exports.check = check;
