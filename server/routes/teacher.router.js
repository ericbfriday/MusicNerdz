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
router.post('/addTeacher', function (req, res) {
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
})

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

module.exports = router;