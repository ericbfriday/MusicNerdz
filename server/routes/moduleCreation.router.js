var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var bodyParser = require( 'body-parser');

var quiz = {};
var questions = [];

router.post('/quiz', (req, res, next) => {
    quiz = req.body.data[0];
    questions = req.body.data[0].questions;
    // console.log('logging quiz in moduleCreation router -> ', quiz);
    // console.log('logging questions in moduleCreation router -> ', questions);
    res.sendStatus(200);
});

module.exports = router;