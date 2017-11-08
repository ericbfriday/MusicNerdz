const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const passport = require('passport');

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

  // add teacher to db -> CURRENTLY DOES NOT INSERT TO USER TABLE OR PROVIDE ENCRYPTION
router.post('/addTeacher', function (req, res) {
  // console.log('in add teacher post req:', req.body);

  pool.connect((err, client, done) => {
    let query = "INSERT INTO teachers (first, last, email, schools_id) VALUES ($1, $2, $3, $4)";
    let saveTeacher = {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      schoolID: req.body.schoolID
    };

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, [saveTeacher.fname, saveTeacher.lname, saveTeacher.email, saveTeacher.schoolID],
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