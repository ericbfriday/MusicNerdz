const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');

router.post('/addClass', function (req, res) {
    console.log('in add class post req:', req);

    pool.connect(function(err, client, done) {
        let query = "INSERT INTO classes (title, code, teachers_id) VALUES ($1, $2, $3)";
        let className = req.body.title;
        let code = req.body.code;        
        let teachId = req.body.teachersId;
        
        if(err) {
          console.log("Error connecting: ", err);
          res.sendStatus(500);
        }
        client.query(query,[className, code, teachId],
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