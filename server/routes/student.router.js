const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

router.post('/addStudent', function (req, res) {
  console.log('in add student post req:', req.body);
  pool.connect(function (err, client, done) {
    let query = "INSERT INTO students (first, last, email, number, classes_id) VALUES ($1, $2, $3" +
        ", $4, $5) RETURNING id";
    let saveStudent = {
      fName: req.body.first,
      lName: req.body.last,
      email: req.body.email,
      number: encryptLib.encryptPassword(req.body.number),
      classId: req.body.classId,
      teachersId: req.body.teachersId
    };
    console.log(saveStudent);

    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client
      .query(query, [
        saveStudent.fName, saveStudent.lName, saveStudent.email, saveStudent.number, saveStudent.classId
      ], function (err, result) {
        client.end();

        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          pool
            .connect(function (err, client, done) {
              console.log('result from insert into student:', result);

              let studentId = result.rows[0].id;
              let userQuery = "INSERT INTO users (type, username, password, students_id, teachers_id) VALUES ($" +
                  "1, $2, $3, $4, $5)";

              if (err) {
                console.log("Error connecting: ", err);
                res.sendStatus(500);
              }
              client
                .query(userQuery, [
                  '1', saveStudent.email, saveStudent.number, studentId, saveStudent.teachersId
                ], function (err, result) {
                  client.end();

                  if (err) {
                    console.log("Error inserting data: ", err);
                    res.sendStatus(500);
                  } else {
                    res.sendStatus(201);
                  }
                });
            });
        }
      });
  });
});

module.exports = router;