const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const bodyParser = require('body-parser');

var quiz = {}; // master quiz variable to hold all questions, answers, etc... for `questions` table
var questions = []; // questions for `questions` table
var newTags = []; // all 'new' tags for insertion into `tags` table & `oldTags` variable
var oldTags = []; // all 'old' tags for insertion into `allTags` variable
var allTags = []; // all tags for insertion into `history_tags` tables. Receives `newTags` and `oldTags` items.

/**
Steps for module creation insert.
1) insert module into `modules` table. return ID. 
2) insert questions into `questions` table using `modules` returned ID.
3) insert historic events into `history` table. 
4) associate all `history` events to `modules` ID.
5) insert tags into `tags` table if they do not exist, returning ID.
6) retain existing tags' IDs and combine with new tags' IDs.
7) insert all tags' IDs into `history_tags` table using returned 
    tags' IDs and returned historic event's IDs.
8) insert all tags' IDs into `module_tags` table using returned
    tags' IDs and returned historic event's IDs.
 */

class Event {
  constructor(title, desc, year, htags) {
    this.title = title;
    this.desc = desc;
    this.year = year;
    this.hTags = htags;
  }
}

var tagSorter = function (tags) {
  tags.forEach(function (tag, i) {
    if (tags[i].type == 'new') {
      newTags.push(tags[i].id);
      allTags.push(tags[i].id);
      // console.log('logging newTags ', newTags);
    } else if (typeof(tags[i].type) == 'string') {
      oldTags.push(tags[i].id);
      allTags.push(tags[i].id);
      // console.log('loggin oldTags ', oldTags);
    } else {
      console.log('Logging error in tagSorter');
    }
  });
  console.log('logging allTags', allTags);
};

// Reference String for /newHistoricalEvent Query Below:
// ** WITH new_event AS (INSERT INTO history (title, description, year) VALUES($1, $2, $3) RETURNING id), new_tag as (INSERT INTO tags (type) VALUES ($4) RETURNING id) INSERT INTO history_tags (history_id, tags_id) VALUES ((SELECT id FROM new_event), (SELECT id FROM new_tag));
// ** WITH new_event AS (INSERT INTO history (title, description, year) VALUES($1, $2, $3) RETURNING id), new_tag AS (INSERT INTO tags (type) VALUES ($4) RETURNING id) INSERT INTO history_tags (history_id, tags_id) VALUES ((SELECT id FROM new_event), (SELECT id FROM new_tag));
// let values = [title, desc, year, **need tags variable**];

router.post('/songCreation', function (req, res, next) {
  console.log('req.body in /songCreation -> ', req.body);
  let songTitle = req.body.songTitle;
  let songAlbum = req.body.songAlbum;
  let songArtist = req.body.songArtist;
  let songYear = req.body.songYear;
  let songURL = req.body.songURL;
  let songDesc = req.body.songDesc;
  let songLyrics = req.body.songLyrics;
  let songArt = req.body.songArt;

  let values = [songDesc, songTitle, songAlbum, songArtist, songYear, songArt, songLyrics, songURL];
  let insertQuery = "INSERT INTO modules (description, title, album, artist, year, art, lyrics, video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;";

  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(insertQuery, values,
      function (err, result) {
        client.end();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.status(203).send(result);
        }
      });
  });
});


router.post('/newHistoricalEvent', function (req, res, next) {
  let title = req.body.title;
  let desc = req.body.desc;
  let year = req.body.year;
  let hTags = req.body.hTags;
  let hTagsType = req.body.hTags[0].type;
  let nEvent = new Event (title, desc, year, hTags);
  let nTag = req.body.hTags[0];
  let queryString = "WITH new_event AS (INSERT INTO history (title, description, year) VALUES($1, $2, $3) RETURNING id), new_tag AS (INSERT INTO tags (type) VALUES ($4) RETURNING id) INSERT INTO history_tags (history_id, tags_id) VALUES ((SELECT id FROM new_event), (SELECT id FROM new_tag));";
  tagSorter(req.body.hTags);
  let values = [title, desc, year, allTags[0]];
  console.log('logging values', values);

  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query(queryString, values,
      function (err, result) {
        client.end();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.status(203).send(res);
        }
      });
  });
});

router.post('/quiz', function (req, res, next) {

  questions = req.body.data[0].questions[0];
  let q = questions.q;
  let a1 = questions.a1;
  let a2 = questions.a2;
  let a3 = questions.a3;
  let a4 = questions.a4;
  let ca = questions.ca;
  let modules_id = req.body.data[0].modulesID;
  let values = [q, a1, a2, a3, a4, ca, modules_id];

  /** ROUTER INSERT STATEMENT CURRENTLY WRONG - PENDING DB POPULATION TO 
   * FIX REQUIREMENTS OF DATA STRUCTURE
   */

  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    client.query("INSERT INTO questions (question_text, type, a, b, c, d, correct, modules_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      values,
      function (err, result) {
        client.end();
        if (err) {
          console.log("Error inserting data: ", err);
          res.sendStatus(500);
        } else {
          res.sendStatus(201);
        }
      });
  });
});

router.get('/existingHistoricalInfo', function (req, res, next) {
  console.log('inside /existingHistoricalInfo in moduleCreation route');
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    }
    // fetches all of the tags to be put into chips at historical events
    client.query("SELECT * FROM tags;", function (err, result) {
      client.end();
      if (err) {
        console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        res.send(result).status(200);
      }
    });
  });
});

module.exports = router;