var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var bodyParser = require( 'body-parser');

// Body parser middleware
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', (req, res, next) => {
    let quiz = req.body.data;
    console.log('logging quiz in moduleCreation router -> ', quiz.questions);
    res.sendStatus(200);
});

module.exports = router;