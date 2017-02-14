const question = require('../../models/question');
const csv = require('express-csv');
var jsonexport = require('jsonexport');

module.exports = (express) => {
  const router = express.Router();

  // Read All
  router.get('/assists', (req, res) => {
    question.findAll( (err) => {
      res.status(500).json(err);
    }, (data) => {
      res.status(200).json(data);
    })
  });

  // Read All
  router.get('/assists/received/:slackUserID/', (req, res) => {
    question.find( {studentSlackUser: req.params.slackUserID }, (err) => {
      res.status(500).json(err);
    }, (data) => {
        res.status(200).json(data);
    })
  });

  // Read One
  router.get('/assists/:id', (req, res) => {
    req.body.id = req.params.id;
    question.find(req.body, (err) => {
      res.status(500).json(err);
    }, (data) => {
      res.status(200).json(data);
    })
  });

  return router;
}
