"use strict";
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

router.post('/addStudent', function (req, res) {
  console.log('in add student post req:', req.body);
  pool.connect(function (err, client, done) {
    let query = "WITH new_student AS (INSERT INTO students (first, last, email, number, classes_i" +
        "d) VALUES ($1, $2, $3, $4, $5) RETURNING id) INSERT INTO users (type, username, " +
        "password, students_id) VALUES (1, $6, $7, (SELECT id FROM new_student))";
    let saveStudent = {
      fName: req.body.first,
      lName: req.body.last,
      email: req.body.email,
      number: encryptLib.encryptPassword(req.body.number),
      classId: req.body.classesId,
      teachersId: req.body.teachersId
    };
    let values = [
      saveStudent.fName,
      saveStudent.lName,
      saveStudent.email,
      saveStudent.number,
      saveStudent.classId,
      saveStudent.email,
      saveStudent.number
    ];
    console.log(saveStudent);

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    } else {
      client
        .query(query, values, function (quErr, resultObj) {
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

router.get('/id/:id', function (req, res) {
  // connect to database
  pool
    .connect(function (err, client, done) {
      // query
      let modQuery = 'SELECT email, first, id, last from students where students.id=$1';
      let target = req.params.id;
      //error handling
      if (err) {
        console.log('Connection Error:', err);
        res.sendStatus(500 //END if connection error
        );
      } else {
        client
          .query(modQuery, [target], function (quErr, resultObj) {
            done();
            //error handling
            if (quErr) {
              console.log('Query Error:', quErr);
              res.sendStatus(500 //END if query error
              );
            } else {
              //send the list from the database to client side
              res.send(resultObj.rows);
            } //END else send
          }); //END client.query
      } //END else send query
    }); //END pool.connect
}); //END router GET

//get all modules from database
router.get('/getAllModules', function (req, res) {
  // connect to database
  pool
    .connect(function (err, client, done) {
      // query
      let modQuery = 'SELECT * FROM modules';
      //error handling
      if (err) {
        console.log('Connection Error:', err);
        res.sendStatus(500 //END if connection error
        );
      } else {
        client
          .query(modQuery, function (quErr, resultObj) {
            done();
            //error handling
            if (quErr) {
              console.log('Query Error:', quErr);
              res.sendStatus(500 //END if query error
              );
            } else {
              //send the list from the database to client side
              res.send(resultObj.rows);
            } //END else send
          }); //END client.query
      } //END else send query
    }); //END pool.connect
}); //END router GET

//get module info from database
router.get('/mod/:id', function (req, res) {
  console.log('calling Module ID: ', req.params.id);
  // connect to database
  pool.connect(function (err, client, done) {
    // query to get module based on id
    let modQuery = 'SELECT resources.link, resources.description AS res_desc, resources.type AS res_' +
        'type, resources.title AS res_title, questions.id, questions.question, questions.' +
        'type, questions.a, questions.b, questions.c, questions.d, questions.correct, mod' +
        'ules.description AS mod_desc, modules.title AS mod_title, modules.album, modules' +
        '.artist, modules.year, modules.lyrics, modules.video, history.description AS his' +
        'tory_desc, history.title AS history_title, tags.type AS tag_type FROM resources,' +
        ' questions JOIN modules ON questions.modules_id = modules.id JOIN modules_histor' +
        'y ON modules.id = modules_history.modules_id JOIN history ON modules_history.his' +
        'tory_id = history.id JOIN history_tags ON history.id = history_tags.history_id J' +
        'OIN tags ON history_tags.tags_id = tags.id WHERE modules.id = $1 ORDER BY questi' +
        'ons.question;';
    // var to hold module id
    let modID = req.params.id;
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500 //END if connection error
      );
    } else {
      client
        .query(modQuery, [modID], function (quErr, resultObj) {
          done();
          //error handling
          if (quErr) {
            console.log('Query Error:', quErr);
            res.sendStatus(500 //END if query error
            );
          } else {
            //send the list from the database to client side
            res.send(resultObj.rows);
          } //END else send
        }); //END client.query
    } //END else send query
  }); //END pool.connect
}); //END router GET

//get student grades info from database
router.get('/getGrades', function (req, res) {
  console.log('logging /getGrades req.user -> ', req.user);

  // connect to database
  pool.connect(function (err, client, done) {
    // query to get grades based on student's id
    let modQuery = 'SELECT modules.title, questions.question, questions.type, questions.modules_id, ' +
        'questions.a, questions.b, questions.c, questions.d, questions.correct, responses' +
        '.response, responses.teacher_comments, responses.final_grade, students.first, st' +
        'udents.last FROM  modules JOIN questions ON modules.id = questions.modules_id JO' +
        'IN responses ON questions.id = responses.questions_id JOIN students ON responses' +
        '.students_id = students.id WHERE students.id = $1';
    // var to hold student id
    let studID = req.user.students_id;
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500 //END if connection error
      );
    } else {
      client
        .query(modQuery, [studID], function (quErr, resultObj) {
          done();
          //error handling
          if (quErr) {
            console.log('Query Error:', quErr);
            res.sendStatus(500 //END if query error
            );
          } else {
            //send the list from the database to client side
            res.send(resultObj.rows);
            console.log('RESULT:', resultObj.rows);
          } //END else send
        }); //END client.query
    } //END else send query
  }); //END pool.connect
}); //END router GET

router.post('/quiz', function (req, res) {
  console.log('BODY!', req.body);
  let ids = req.body.ids;
  let resps = req.body.resps;
  let student = 9;
  // connect to database
  pool.connect(function (err, client, done) {
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500 //END if connection error
      );
    } else {
      // query
      let modQuery = 'INSERT INTO responses (students_id, response, questions_id) VALUES ($1, $2, $3)';
      for (var i = 0; i < req.body.data.length; i++) {
        client
          .query(modQuery, [
            req.body.data[i].studId, req.body.data[i].resp, req.body.data[i].questId
          ], function (quErr, resultObj) {
            done();
            //error handling
            if (quErr) {
              console.log('Query Error:', quErr);
              res.sendStatus(500 //END if query error
              );
            } else {
              console.log('posted');
            } //END else posted
          }); //END client.query
      } //END for loop
    } //END else send query
  }); //END pool.connect
}); //END router POST

router.get('/modules/:id', function (req, res) {
  console.log('modules route ', req.params.id);
  // connect to database
  pool.connect(function (err, client, done) {
    // query to get grades based on student's id
    let query = 'SELECT modules.* from users inner join students on users.students_id = students.' +
        'id inner join classes_modules on students.classes_id = classes_modules.classes_i' +
        'd inner join modules on classes_modules.modules_id = modules.id where users.id =' +
        ' $1;';
    let studID = req.params.id;
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500 //END if connection error
      );
    } else {
      if (studID === 'all') {
        client
          .query('SELECT * from modules', function (quErr, resultObj) {
            done();
            //error handling
            if (quErr) {
              console.log('Query Error:', quErr);
              res.sendStatus(500 //END if query error
              );
            } else {
              //send the list from the database to client side
              console.log('sending all modules');
              res.send(resultObj.rows);
            } //END else send
          }); //END client.query
      } else {
        client
          .query(query, [studID], function (quErr, resultObj) {
            done();
            //error handling
            if (quErr) {
              console.log('Query Error:', quErr);
              res.sendStatus(500 //END if query error
              );
            } else {
              //send the list from the database to client side
              console.log('sending targetted modules');
              res.send(resultObj.rows);
            } //END else send
          }); //END client.query
      } //END else
    } //END else send query
  }); //END pool.connect
}); //END router GET

//get all modules from database
router.get('/getFeedback/:id', function (req, res) {
  let feedbackModID = req.params.id;
  console.log('logging feedbackModID in student.router /getFeedback/:id -> ', feedbackModID);
  // connect to database
  pool.connect(function (err, client, done) {
    // query
    let query = 'SELECT r.admin_notes FROM responses r JOIN questions q ON (r.questions_id=q.id) ' +
        'JOIN modules m ON (q.modules_id=m.id) WHERE r.questions_id = q.id AND q.modules_' +
        'id = $1;';
    let values = [feedbackModID];
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500 //END if connection error
      );
    } else {
      client
        .query(query, values, function (error, resp) {
          done();
          if (error) {
            console.log('Query Error:', error);
            res.sendStatus(500 //END if query error
            );
          } else {
            console.log('logging resp in /getFeedback/ ->', resp);
            res
              .send(resp)
              .status(200);
          } //END else send
        }); //END client.query
    } //END else send query
  }); //END pool.connect
}); //END router GET

router.post('/submitFb', function (req, res) {
  console.log('req.body feedback:', req.body);
  pool.connect(function (err, client, done) {
    let feedbackQuery = 'INSERT INTO responses (admin_notes) VALUES ($1)';
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } else {
      client
        .query(feedbackQuery, [req.body.feedback], function (err, obj) {
          done();

          if (err) {
            console.log('query error:', err);
            res.sendStatus(500 //end if query error
            );
          } else {
            res.sendStatus(200);
            console.log(obj);
          }
        }); //end client.query
    } //end client.query
  }); //end pool.connect
});

module.exports = router;