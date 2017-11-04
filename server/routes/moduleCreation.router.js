var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var bodyParser = require( 'body-parser');

// Body parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

var quiz = {};

router.post('/quiz', (req, res, next) => {
    quiz = req.body.data[0];
    console.log('logging quiz in moduleCreation router -> ', quiz);
    console.log('logging quiz.name in moduleCreation router -> ', quiz.name);
    console.log('logging quiz.questions in moduleCreation router -> ', quiz.questions);
    res.sendStatus(200);
});

module.exports = router;