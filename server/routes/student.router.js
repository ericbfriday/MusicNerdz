const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const encryptLib = require('../modules/encryption');

router.post('/addStudent', function (req, res) {
    console.log('in add student post req:', req.body);
    pool.connect(function(err, client, done) {
        let query = "INSERT INTO students (first, last, email, number, classes_id) VALUES ($1, $2, $3, $4, $5) RETURNING id";
        let saveStudent = {
            fName: req.body.first,
            lName: req.body.last,
            email: req.body.email,
            number: encryptLib.encryptPassword(req.body.number),
            classId: req.body.classId,
            teachersId: req.body.teachersId,
        };
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
                pool.connect(function(err, client, done) {
                  console.log('result from insert into student:', result);

                  let studentId = result.rows[0].id;
                  let userQuery = "INSERT INTO users (type, username, password, students_id, teachers_id) VALUES ($1, $2, $3, $4, $5)";
                  
                  if(err) {
                    console.log("Error connecting: ", err);
                    res.sendStatus(500);
                  }
                  client.query(userQuery,
                    ['1', saveStudent.email, saveStudent.number, studentId, saveStudent.teachersId],
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
              }
            });
      });
});

//get all modules from database
router.get('/getAllModules', function (req, res) {
  // connect to database
  pool.connect(function (err, client, done) {
    // query 
    let modQuery = 'SELECT * FROM modules'
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } //END if connection error
    else {
      client.query(modQuery, function (quErr, resultObj) {
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
      }) //END client.query
    } //END else send query
  })//END pool.connect
})//END router GET

//get module info from database
router.get('/getModule', function (req, res){
  // connect to database
  pool.connect(function (err, client, done){
    // query to get module based on id
    let modQuery = 'SELECT * FROM history JOIN modules_history ON history.id = modules_history.history_id JOIN modules ON modules_history.modules_id = modules.id JOIN questions ON modules.id = questions.modules_id WHERE modules.id = $1;'
    // var to hold module id
    let modID = 5;
    //error handling
    if (err) {
      console.log('Connection Error:', err);
      res.sendStatus(500);
    } //END if connection error
    else {
      client.query(modQuery, [modID], function (quErr, resultObj) {
        done();
        //error handling
        if (quErr) {
          console.log('Query Error:', quErr);
          res.sendStatus(500);
        } //END if query error
        else {
          //send the list from the database to client side
          res.send(resultObj.rows);
          console.log('RESULT:', resultObj.rows );
        } //END else send
      }) //END client.query
    } //END else send query
  })//END pool.connect
})//END router GET

// **********Modules queries*********
// SELECT * FROM modules WHERE modules.id = 5;
// SELECT * FROM questions WHERE modules_id = 5;
// SELECT * FROM history
// JOIN modules_history ON history.id = modules_history.history_id
// JOIN modules ON modules_history.modules_id = modules.id
// WHERE modules.id = 5;


module.exports = router;