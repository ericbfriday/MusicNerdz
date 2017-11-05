const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.post('/addTeacher', function (req, res) {
    console.log('in add teacher post req:', req);

    pool.connect(function(err, client, done) {
        let query = "INSERT INTO teachers (name, email, password) VALUES ($1, $2, $3)";
        let saveTeacher = {
            name: req.body.name,
            email: encryptLib.encryptPassword(req.body.email),
            password: encryptLib.encryptPassword(req.body.password)            
        };
        
        if(err) {
          console.log("Error connecting: ", err);
          res.sendStatus(500);
        }
        client.query(query,[saveTeacher.name, saveTeacher.email, saveTeacher.password],
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