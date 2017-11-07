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