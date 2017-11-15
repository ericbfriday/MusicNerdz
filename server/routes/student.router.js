const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

router.post('/addStudent', function (req, res) {
  console.log('in add student post req:', req.body);
  pool.connect(function (err, client, done) {
    let query = "WITH new_student AS (INSERT INTO students (first, last, email, number, classes_id) VALUES ($1, $2, $3, $4, $5) RETURNING id) INSERT INTO users (type, username, password, students_id) VALUES (1, $6, $7, (SELECT id FROM new_student))";
    let saveStudent = {
      fName: req.body.first,
      lName: req.body.last,
      email: req.body.email,
      number: encryptLib.encryptPassword(req.body.number),
      classId: req.body.classId,
      teachersId: req.body.teachersId,
    };
    let values = [saveStudent.fName, saveStudent.lName, saveStudent.email, saveStudent.number, saveStudent.classId, saveStudent.email, saveStudent.number];
    console.log(saveStudent);

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    } else {
      client.query(query, values, function (quErr, resultObj) {
        done();
        if (quErr) {
          console.log("Error connecting: ", quErr);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
    }
  });
});

//get all modules from database
router.get('/getAllModules', function (req, res) {
  // connect to database
  pool.connect(function (err, client, done) {
    // query 

    let modQuery = 'SELECT * FROM modules';

    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } //END if connection error
    else {
      client.query(modQuery, function (quErr, resultObj) {
        done();
        //error handling
        if (quErr) {
          console.log('Query Error:', quErr);
          res.sendStatus(500);
        } //END if query error
        else {
          //send the list from the database to client side
          res.send(resultObj.rows);
        } //END else send

      }); //END client.query
    } //END else send query
  }); //END pool.connect
}); //END router GET


//get module info from database
router.get('/getModule', function (req, res) {
  // connect to database
  pool.connect(function (err, client, done) {
    // query to get module based on id
    let modQuery = 'SELECT questions.id, questions.question, questions.type, questions.a, questions.b, questions.c, questions.d, questions.correct, modules.description AS mod_desc, modules.title AS mod_title, modules.album, modules.artist, modules.year, modules.lyrics, modules.video, history.description AS history_desc, history.title AS history_title FROM questions JOIN modules ON questions.modules_id = modules.id JOIN modules_history ON modules.id = modules_history.modules_id JOIN history ON modules_history.history_id = history.id WHERE modules.id = $1 ORDER BY questions.question;'
    // var to hold module id
    let modID = 5;
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } //END if connection error
    else {
      client.query(modQuery, [modID], function (quErr, resultObj) {
        done();
        //error handling
        if (quErr) {
          console.log('Query Error:', quErr);
          res.sendStatus(500);
        } //END if query error
        else {
          //send the list from the database to client side
          res.send(resultObj.rows);
          // console.log('RESULT:', resultObj.rows);
        } //END else send
      }); //END client.query
    } //END else send query

  }); //END pool.connect
}); //END router GET


//get student grades info from database
router.get('/getGrades', function (req, res) {
  // connect to database
  pool.connect(function (err, client, done) {
    // query to get grades based on student's id

    let modQuery = 'SELECT questions.question, questions.type, questions.modules_id, questions.a, questions.b, questions.c, questions.d, questions.correct, responses.response, responses.teacher_comments, responses.final_grade, students.first, students.last FROM questions JOIN responses ON questions.id = responses.questions_id JOIN students ON responses.students_id = students.id WHERE students.id = $1';

    // var to hold student id
    let studID = 5;
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } //END if connection error
    else {
      client.query(modQuery, [studID], function (quErr, resultObj) {
        done();
        //error handling
        if (quErr) {
          console.log('Query Error:', quErr);
          res.sendStatus(500);
        } //END if query error
        else {
          //send the list from the database to client side
          res.send(resultObj.rows);
          console.log('RESULT:', resultObj.rows);
        } //END else send
      }); //END client.query
    } //END else send query

  }); //END pool.connect
}); //END router GET

module.exports = router;