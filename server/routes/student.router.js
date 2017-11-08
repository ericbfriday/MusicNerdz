const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

router.post('/addStudent', function (req, res) {
    console.log('in add student post req:', req.body);
    pool.connect(function(err, client, done) {
        let query = "WITH new_student AS (INSERT INTO students (first, last, email, number, classes_id) VALUES ($1, $2, $3, $4, $5) RETURNING id) INSERT INTO users (type, username, password, teachers_id) VALUES (1, $5, $6, (SELECT id FROM new_student))"
        let saveStudent = {
            fName: req.body.first,
            lName: req.body.last,
            email: req.body.email,
            number: encryptLib.encryptPassword(req.body.number),
            classId: req.body.classId,
            teachersId: req.body.teachersId,
        };
        let values = [saveStudent.fName, saveStudent.lName, saveStudent.email, saveStudent.number, saveStudent.classId, saveStudent.email, saveStudent.number]
        console.log(saveStudent);
        
        if(err) {
          console.log("Error connecting: ", err);
          res.sendStatus(500);
        }
        client.query(query,
            [saveStudent.fName, saveStudent.lName, saveStudent.email, saveStudent.number, saveStudent.classId],
            function (err, result) {
              client.end();
    
              if(err) {
                console.log("Error inserting data: ", err);
                res.sendStatus(500);
              } else {
                res.sendStatus(201);
              }
            });
      });
});


module.exports = router;