const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const passport = require('passport');

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
});

router.post('/addTeacher', function (req, res) {
  console.log('in add teacher post req:', req.body);

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
});

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
});

module.exports = router;