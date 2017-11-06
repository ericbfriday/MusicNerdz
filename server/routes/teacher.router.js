const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.post('/addSchool', function (req, res) {
  console.log('in add school post req:', req.body);

  pool.connect(function (err, client, done) {
    let query = "INSERT INTO schools (name) VALUES ($1)";
    let saveSchool = {name: req.body.name};
    console.log('saveSchool.name -> ', saveSchool.name);
    
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, [saveSchool.name],
      function (err, result) {
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

  pool.connect(function (err, client, done) {
    let query = "INSERT INTO teachers (name, email, password) VALUES ($1, $2, $3)";
    let saveTeacher = {
      name: req.body.name,
      email: encryptLib.encryptPassword(req.body.email),
      password: encryptLib.encryptPassword(req.body.password)
    };

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(query, [saveTeacher.name, saveTeacher.email, saveTeacher.password],
      function (err, result) {
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
    client.query( queryString, (err, result) => {
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