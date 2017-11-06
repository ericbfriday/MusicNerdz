const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const bodyParser = require( 'body-parser');

var quiz = {};
var questions = [];

router.post('/quiz', (req, res, next) => {

    questions = req.body.data[0].questions[0];
    let q = questions.q;
    let a1 = questions.a1;
    let a2 = questions.a2;
    let a3 = questions.a3;
    let a4 = questions.a4;
    let ca = questions.ca;
    let values = [q, a1, a2, a3, a4, ca];

    // console.log('logging questions in moduleCreation router -> ', questions);
    console.log('logging values in moduleCreation router -> ', values);

    pool.connect(function(err, client, done) {
        if(err) {
          console.log("Error connecting: ", err);
          res.sendStatus(500);
        }
        client.query("INSERT INTO questions (question_text, type, a, b, c, d, correct) VALUES ($1, $2, $3, $4, $5, $6)",
          values,
            function (err, result) {
              client.end();
              if(err) {
                console.log("Error inserting data: ", err);
                res.sendStatus(500);
              } else {
                res.sendStatus(201);
              }
            });
      });
});

module.exports = router;