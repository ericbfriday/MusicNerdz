const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.post('/addStudent', function (req, res) {
    console.log('in add student post req:', req);

    pool.connect(function(err, client, done) {
        let query = "INSERT INTO students (first, last, student_id, classes_id, teacher_id) VALUES ($1, $2, $3, $4, $5)";
        let fName = req.body.first;
        let lName = req.body.last;
        let sId = req.body.sId;
        let classId = req.body.classId;
        let teachId = req.body.teachId;
        
        if(err) {
          console.log("Error connecting: ", err);
          res.sendStatus(500);
        }
        client.query(query,[fName, lName, sId, classId, teachId],
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