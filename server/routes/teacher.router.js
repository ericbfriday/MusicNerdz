"use strict";
const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const passport = require('passport');
const encryptLib = require('../modules/encryption');

// Adds school to DB so it may later be associated to teacher.
router.post('/addSchool', function (req, res) {
  pool.connect(function (err, client, done) {
    let query = "INSERT INTO schools (name) VALUES ($1)";
    let saveSchool = {
      name: req.body.name
    };
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, [saveSchool.name],
      (err, result) => {
        client.end();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result).status(203);
        }
      });
  });
}); // end addSchool

// adds teacher to user and teachers DB.
router.post('/addTeacher', (req, res) => {
  pool.connect((err, client, done) => {
    let query = "WITH new_teacher AS (INSERT INTO teachers (first, last, email, schools_id) VALUES ($1, $2, $3, $4) RETURNING id) INSERT INTO users (type, username, password, teachers_id) VALUES (2, $5, $6, (SELECT id FROM new_teacher));";
    let values = [req.body.fname, req.body.lname, req.body.email, req.body.schoolID, req.body.email, encryptLib.encryptPassword(req.body.password)];
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, values,
      (err, result) => {
        client.end();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.send(result).status(203);
        }
      });
  });
}); // end /addTeacher

//update assigned modules
router.post('/assign', (req, res) => {
  console.log('req.body in assign post', req.body);
  let classArr = req.body.classArr;
  let moduleId = req.body.moduleId;

  pool.connect((err, client, done) => {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    for (let i = 0; i < classArr.length; i++) {
      let classId = classArr[i];
      let query = "INSERT INTO classes_modules (classes_id, modules_id) VALUES ($1, $2)";
      let values = [classId, moduleId];
      console.log('values', values);

      client.query(query, values, (err, response) => {
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          console.log('insert in classes_modules', response);
        }
      });
    }
  });
  res.sendStatus(203);
});

//get all assigned module info that matches class Id
router.get('/assigned/:classIdParam', function (req, res) {
  console.log('getting assigned module info with', req.params.classIdParam);
  pool.connect(function (err, client, done) {
    let queryString = "SELECT responses.response, responses.final_grade, responses.students_id AS stud_id, modules.id AS mod_id, modules.title FROM students JOIN responses ON students.id = responses.students_id JOIN questions ON responses.questions_id = questions.id JOIN modules ON questions.modules_id = modules.id WHERE students.classes_id = $1;";
    let value = [req.params.classIdParam];

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(queryString, value, function (err, result) {
      client.end();
      if (err) {
        console.log("Error querying data in /assigned GET route: ", err);
        res.sendStatus(500);
      } else {
        res.send(result.rows);
      }
    });
  });
});

//get list of students by class
router.get('/students/:classParam', (req, res) => {
  console.log('in get students teacher route with', req.params.classParam);
  pool.connect(function (err, client, done) {
    let queryString = "SELECT * FROM students WHERE classes_id = $1;";
    let value = [req.params.classParam];

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(queryString, value, (err, result) => {
      client.end();
      if (err) {
        console.log("Error querying data in /students GET route: ", err);
        res.sendStatus(500);
      } else {
        res.send(result.rows);
        // console.log('ef testing -> ', result.rows);
      }
    });
  });
}); // end /students

//get classes and students
router.get('/classes/:teacherParam', (req, res) => {
  console.log('in get classes teacher route with', req.params.teacherParam);
  pool.connect(function (err, client, done) {
    let queryString = "SELECT students.id AS studId, students.first, students.last, students.email, students.classes_id, classes.id AS classId, classes.title, classes.code, classes.teachers_id FROM students FULL OUTER JOIN classes ON students.classes_id = classes.id WHERE classes.teachers_id = $1;";
    let value = [req.params.teacherParam];

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(queryString, value, (err, result) => {
      client.end();
      if (err) {
        console.log("Error querying data in /students GET route: ", err);
        res.sendStatus(500);
      } else {
        res.send(result.rows);
      }
    });
  });
}); // end /students

// gets list of schools to associate to teacher upon teacher creation
router.get('/schools', (req, res) => {
  // console.log('Inside schools of teacher.router.js');
  pool.connect(function (err, client, done) {
    let queryString = "SELECT * FROM schools;";
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(queryString, (err, result) => {
      client.end();
      if (err) {
        console.log("Error querying data in /schools GET route: ", err);
        res.sendStatus(500);
      } else {
        res.send(result).status(200);
      }
    });
  });
}); // end /schools

// gets list of schools to associate to teacher upon teacher creation
router.get('/teachers', (req, res) => {
  // console.log('Inside schools of teacher.router.js');
  pool.connect(function (err, client, done) {
    let queryString = "SELECT * FROM teachers;";
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(queryString, (err, result) => {
      client.end();
      if (err) {
        console.log("Error querying data in /teachers GET route: ", err);
        res.sendStatus(500);
      } else {
        res.send(result).status(200);
      }
    });
  });
}); // end /teachers

router.delete('/deleteSchool/:id', (req, res) => {
  console.log('logging req.params.id in /deleteSchool -> ', req.params.id);
  pool.connect(function (err, client, done) {
    let query = "DELETE FROM schools WHERE id = $1;";
    let value = [req.params.id];
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, value, (err, result) => {
      client.end();
      if (err) {
        console.log("Error querying data in /deleteSchool DELETE route: ", err);
        res.sendStatus(500);
      } else {
        res.send(result.rows).status(200);
      }
    });
  });
});

router.delete('/deleteTeacher/:id', (req, res) => {
  console.log('logging req.params.id in /deleteteacher -> ', req.params.id);
  pool.connect(function (err, client, done) {
    let query = "DELETE FROM teachers WHERE id = $1;";
    let value = [req.params.id];
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, value, (err, result) => {
      client.end();
      if (err) {
        console.log("Error querying data in /deleteteacher DELETE route: ", err);
        res.sendStatus(500);
      } else {
        // console.log('logging result.rows in /deleteteacher -> ', result.row);
        res.send(result.rows).status(200);
      }
    });
  });
});

router.delete('/deleteStudent/:id', function (req, res) {
  console.log('logging req.params.id in /deleteStudent:', req.params.id);
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } else {
      console.log('DELETE:', req.params.id);
      let studId = [req.params.id];
      client.query('DELETE from students WHERE id = $1', studId, function (err, obj) {
        done();
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.send(obj);
        }
      });
    }
  }); //end pool.connect
}); //end router.delete

router.delete('/deleteClass/:id', function (req, res) {
  console.log('logging req.params.id in /deleteClass:', req.params.id);
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Connection Error', err);
      res.sendStatus(500);
    } else {
      console.log('DELETE:', req.params.id);
      let classId = [req.params.id];
      client.query('DELETE from classes WHERE id = $1', classId, function (err, obj) {
        done();
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.send(obj);
        }
      });
    }
  }); //end pool.connect
}); //end router.delete

// Below gets the grades of a student based off their ID. It's used in the user service when the teacher pulls a students grades.
// this mostly duplicates the /getGrades code from the student router, however it uses the param id to find the student
// instead of the user.id.
router.get('/getGrades/:id', function (req, res) {
  // console.log('logging /getGrades req.params.id -> ', req.params.id);
  // connect to database
  pool.connect(function (err, client, done) {
    // query to get grades based on student's id
    let modQuery = 'SELECT questions.question, questions.type, questions.modules_id, questions.a, questions.b, questions.c, questions.d, questions.correct, responses.response, responses.teacher_comments, responses.final_grade, students.first, students.last FROM questions JOIN responses ON questions.id = responses.questions_id JOIN students ON responses.students_id = students.id WHERE students.id = $1';
    // var to hold student id
    let studID = req.params.id;
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
          // console.log('RESULT:', resultObj.rows);
        } //END else send
      }); //END client.query
    } //END else send query
  }); //END pool.connect
}); //END router GET

router.post('/gradedQuiz', function (req, res) {
  console.log('Logging req.body in /graded', req.body);
  let userObject = req.body;
  let obj = [];
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Connection Error', err);
      res.sendStatus(500);
    } else {
      userObject.studentinfo.forEach((ele, i) => {
        // variables here
        let query = "SET responses.final_grade = $1, responses.teacher_comments = $2 FROM responses JOIN responses ON questions.id = responses.questions_id JOIN students ON responses.students_id = students.id WHERE students.id = $3 AND questions.id = $4";
        let values = [req.body.final_grade, req.body.teacher_comments, req.body.student_id, req.body.questions_id]; // questions.modules_id
        client.query(query, values, function (err, obj) {
          if (err) {
            console.log(err);
            res.sendStatus(500);
          } else {
            // res.send(obj);
            console.log('logging success in SET comment!');
            
          }
        });
      });
    }
    // client.end();
  });
});

module.exports = router;