var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();

var passport = require('./strategies/sql.localstrategy');
var sessionConfig = require('./modules/session.config');

// Route includes
var indexRouter = require('./routes/index.router');
var userRouter = require('./routes/user.router');
var registerRouter = require('./routes/register.router');
var resetRouter = require('./routes/pwreset.router');

var teacherRouter = require('./routes/teacher.router');
var studentRouter = require('./routes/student.router');
var classRouter = require('./routes/class.router');
var moduleCreation = require('./routes/moduleCreation.router');


var port = process.env.PORT || 8080;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Serve back static files
app.use(express.static('./server/public'));

// Passport Session Configuration
app.use(sessionConfig);

// Start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', registerRouter);
app.use('/user', userRouter);
app.use('/resetRoute', resetRouter);

app.use('/teacher', teacherRouter);
app.use('/class', classRouter);
app.use('/student', studentRouter);
app.use('/moduleCreation', moduleCreation);


// Catch all bucket, must be last!
app.use('/', indexRouter);

// Listen //
app.listen(port, function(){
   console.log('Listening on port:', port);
});
