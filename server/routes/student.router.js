const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

router.post('/addStudent', function (req, res) {
    console.log('in add student post req:', req.body);
    pool.connect(function(err, client, done) {
        let query = "WITH new_student AS (INSERT INTO students (first, last, email, number, classes_id) VALUES ($1, $2, $3, $4, $5) RETURNING id) INSERT INTO users (type, username, password, students_id) VALUES (1, $6, $7, (SELECT id FROM new_student))"
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
        } else {
          client.query(query, values, function (quErr, resultObj) {
            done();
            if (quErr) {
              console.log("Error connecting: ", quErr);
              res.sendStatus(500);
            } else {
              res.sendStatus(201);
            };
          });
        }
    });
});

//get module info from database
router.get('/getModule', function (req, res){
  // connect to database
  pool.connect(function (err, client, done){
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } //END if connection error
    else {
      client.query('SELECT * FROM modules', function (quErr, resultObj) {
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
  });//END pool.connect
});//END router GET
module.exports = router;