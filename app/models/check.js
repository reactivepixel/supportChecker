const db = require('./db');

exports.create = (payload, err, success) => {
  db.check.create(payload).then(success).catch(err);
}

exports.findAll = (err, success) => {
  db.check.findAll().then(success).catch(err);
}

exports.find = (payload, err, success) => {
  db.check.findAll({
    where: payload,
    // Find all relations in sequelize
    include: [{
      all: true,
      nested: true,
    }],
  }).then(success).catch(err);
}

exports.update = (payload, err, success) => {
  db.check.find({
    where: {
      id: payload.id,
    }
  }).then( (existingData) => {
    existingData.updateAttributes(payload).then(success).catch(err);
  }).catch(err);
}

exports.destroy = (payload, err, success) => {
  db.check.destroy({
    where: {
      id: payload.id,
    }
  }).then(success).catch(err);
}
