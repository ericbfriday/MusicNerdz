const express = require('express');
const router = express.Router();
const pool = require('../modules/pool.js');
const bodyParser = require('body-parser');
const async = require('async');

/** Still need to empty arrays and objects for submitting second and third modules. */

class Event {
  constructor(title, desc, year, htags) {
    this.title = title;
    this.desc = desc;
    this.year = year;
    this.hTags = htags;
  }
}

class EventList {
  constructor(events) {
    this.events = events;
  }
}

class Module {
  constructor(song, events, resources, questions) {
    this.song = song;
    this.events = events;
    this.resources = resources;
    this.questions = questions;
  }
}

class Song {
  constructor(title, album, artist, year, URL, desc, lyrics, art) {
    this.title = title;
    this.album = album;
    this.artist = artist;
    this.year = year;
    this.URL = URL;
    this.desc = desc;
    this.lyrics = lyrics;
    this.art = art;
  }
}

class ResourceList {
  constructor(resources) {
    this.resources = resources;
  }
}

class QuestionList {
  constructor(questions) {
    this.questions = questions;
  }
}

let questions = []; // questions for `questions` table
let newTags = []; // all 'new' tags for insertion into `tags` table & `oldTags` variable
let oldTags = []; // all 'old' tags for insertion into `allTags` variable
let moduleID = {id: 0};
let associatedEvents = {data: null};

let moduleSong = {}; // new Song(title, album, artist, year, URL, desc, lyrics, art);
let moduleEventList = {}; // new EventList(events);
let moduleResourceList = {}; // new ResourceList(resources);
let moduleQuestionList = {}; // new QuestionList(questions);

function initModule(res) {
  let finalModule = new Module(moduleSong, moduleEventList, moduleResourceList, moduleQuestionList);
  console.log('logging finalModule', finalModule);
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting in initModule: ", err);
      res.sendStatus(500);
    } else {
      console.log('createModule() activated & connected!');
      let query = "";
      let values = [];
      console.log('initModule() query -> ', query);
      client.query(query, values,
        function (err, result) {
          if (err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(500);
          } else {
            console.log('Result in event insert statement-> ', result);
            // send result of insert here.
          }
        });
    }
    done();
  });
}

// /quiz will have to handle creating new module right after creating new moduleQuestionList.

var tagSorter = function (tags) {
  tags.forEach(function (tag, i) {
    if (tags[i].type == 'new') {
      newTags.push(tags[i].name);
    } else if (typeof (tags[i].type) == 'string') {
      oldTags.push(tags[i].id);
    } else {
      console.log('Logging error in tagSorter');
    }
  });
};

// Original queryString and values -> let queryString = "WITH new_event AS (INSERT INTO history (title, description, year) VALUES($1, $2, $3) RETURNING id), new_tag AS (INSERT INTO tags (type) VALUES ($4) RETURNING id) INSERT INTO history_tags (history_id, tags_id) VALUES ((SELECT id FROM new_event), (SELECT id FROM new_tag));";
// Original queryString and values -> let values = [nEvent.title, nEvent.desc, nEvent.year, newTags[i]];

// The below function inserts a new historical event into the db. It also adds historical tags (old and new), and associates those tags to the event.
router.post('/newHistoricalEvent', function (req, res, next) {
  let nEventID = 0;
  let newTagsID = null;
  let oldTagsID = [];
  let nEvent = new Event(req.body.title, req.body.desc, req.body.year, req.body.hTags);

  console.log('Logging nEvent in /newHistoricalEvent ', nEvent);
  tagSorter(nEvent.hTags);
  // console.log('newTags ', newTags);
  // console.log('oldTags', oldTags);
  pool.connect(function (err, client, done) {
    let firstInsert = function (client) { 
      //FIRST QUERY INSERTS HISOTRICAL EVENT AND RETURNS ID
      let initialQueryString = "INSERT INTO history (title, description, year) VALUES($1, $2, $3) RETURNING id;";
      let initialQueryValues = [nEvent.title, nEvent.desc, nEvent.year];
      // console.log('firstInsert: logging values in initialQuery (event insertion)', initialQueryValues);
      client.query(initialQueryString, initialQueryValues,
        function (err, result) {
          if (err) {
            console.log("Error inserting data: ", err);
            res.sendStatus(500);
          } else {
            // console.log('Result in event insert statement-> ', result);
            nEventID = result.rows[0].id; // sets nEventID to the event ID returned by the first query string.
            // console.log('logging nEventID -> ', nEventID);
            secondInsert(client);
          }
        });
    };
    let secondInsert = function (client) {
      // SECOND QUERY INSERTS NEW TAGS, RETURNS ID, & ASSOCIATES TO HISTORICAL EVENT
      for (let i = 0; i < newTags.length; i++) {
        let newTagQueryString = "INSERT INTO tags (type) VALUES ($1) RETURNING id";
        let newTagQueryValues = [newTags[i]];
        // console.log('secondInsert: logging values in newTagQueryValues (new tags event insertion) -> ', newTagQueryValues);
        client.query(newTagQueryString, newTagQueryValues,
          function (err, result) {
            if (err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              // console.log('Result in new query tag insert statement -> ', result);
              newTagsID = result.rows[0].id;
              // console.log('secondInsert: logging newTagsID => ', newTagsID);
              fourthInsert(client, nEventID, newTagsID);
            }
          });
      }
      thirdInsert(client, nEventID, newTagsID);
    };
    let thirdInsert = function (client, nEventID, newTagsID) {
      // THIRD QUERY ASSOCIATES EXISTING HISTORICAL EVENTS TO NEW HISTORICAL EVENT
      for (let i = 0; i < oldTags.length; i++) {
        let oldTagQueryString = "INSERT INTO history_tags (history_id, tags_id) VALUES ($1, $2)";
        let oldTagQueryValues = [nEventID, oldTags[i]];
        // console.log('thirdInsert: logging values in history_tags insert statement -> ', oldTagQueryValues);
        client.query(oldTagQueryString, oldTagQueryValues,
          function (err, result) {
            if (err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              // console.log('thirdInsert: Result in history_tags insert statemet -> ', result);
            }
          });
      }
      fourthInsert(client, nEventID, newTagsID);
    };
    let fourthInsert = function (client, nEventID, newTagsID) {
      // FOURTH QUERY ASSOCIATES NEW HISTORICAL EVENTS TO NEW HISTORICAL EVENT
      // console.log('Activated fourthInsert -> newTagsId -> ', newTagsID);
      if (newTagsID != null){
        let newTagsInsertQueryString = "INSERT INTO history_tags (history_id, tags_id) VALUES ($1, $2)";
        let newTagsInsertQueryValues = [nEventID, newTagsID];
        // console.log('fourthInsert: logging values in new tags history_tags insert statement -> ', newTagsInsertQueryValues);
        client.query(newTagsInsertQueryString, newTagsInsertQueryValues,
          function (err, result) {
            if (err) {
              console.log("Error inserting data: ", err);
              res.sendStatus(500);
            } else {
              console.log('Result in new tags history_tags insert statemet -> completed');
            }
          });
      done();
        }
    };
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    } else {
      // EXECUTES FIRST INSERT, WHICH CALLS SECOND INSERT, WHICH CALLS THIRD INSERT, WHICH CALLS FOURTH INSERT.
    firstInsert(client);
    }
    res.sendStatus(201);
  });
});

router.post('/resources', function (req, res, next) {
  let resources = req.body.data;
  // console.log('resources -> ', resources);
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting: ", err);
      res.sendStatus(500);
    } else {
      moduleResourceList = new ResourceList(resources);
      console.log('logging moduleResourceList -> ', moduleResourceList);
      res.sendStatus(200);
      // for (let i = 0; i < resources.length; i++) {
      //   let query = 'INSERT INTO resources (description, type, link, modules_id, title) VALUES ($1, $2, $3, $4, $5);';
      //   let values = [resources[i].desc, resources[i].type, resources[i].url, moduleID.id, resources[i].title];
      //   // console.log('loggin values -> ', values);
      //   client.query(query, values,
      //     function (err, result) {
      //       if (err) {
      //         console.log("Error inserting data: ", err);
      //         res.sendStatus(500);
      //       } else {
      //         // console.log('log result -> ', result.rows);
      //       }
      //     });
      // }
    }
    // done();
    // res.sendStatus(201);
  });
});

router.post('/songCreation', function (req, res, next) {
  // console.log('req.body in /songCreation -> ', req.body);
  let songTitle = req.body.songTitle;
  let songAlbum = req.body.songAlbum;
  let songArtist = req.body.songArtist;
  let songYear = req.body.songYear;
  let songURL = req.body.songURL;
  let songDesc = req.body.songDesc;
  let songLyrics = req.body.songLyrics;
  let songArt = req.body.songArt;
  moduleSong = new Song(songTitle, songAlbum, songArtist, songYear, songURL, songDesc, songLyrics, songArt);
  console.log('logging moduleSong => ', moduleSong);
  res.sendStatus(200);

  // let values = [songDesc, songTitle, songAlbum, songArtist, songYear, songArt, songLyrics, songURL];
  // let insertQuery = "INSERT INTO modules (description, title, album, artist, year, art, lyrics, video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id;";

  // pool.connect(function (err, client, done) {
  //   if (err) {
  //     console.log("Error connecting: ", err);
  //     res.sendStatus(500);
  //   }
  //   client.query(insertQuery, values,
  //     function (err, result) {
  //       client.end();
  //       if (err) {
  //         console.log("Error inserting data: ", err);
  //         res.sendStatus(500);
  //       } else {
  //         moduleID.id = result.rows[0].id;
  //         // sets router variable moduleId to ID of last inserted mosule for association to other insert statements.
  //         console.log('moduleID -> ', moduleID.id);
  //         res.status(203).send(result);
  //       }
  //     });
  // });
});

router.post('/associatedEvents', function (req, res, next) {
  associatedEvents.data = req.body.data;
  moduleEventList = new EventList(associatedEvents.data);
  console.log('logging moduleEventList in associatedEvents -> ', moduleEventList);
  res.sendStatus(200);
});

router.post('/quiz', function (req, res, next) {
  questions = req.body.data;
  moduleQuestionList.questions = new QuestionList(questions);
  console.log('logging moduleQuestionList in associatedEvents -> ', moduleQuestionList);
  initModule(res);
  // let q = questions.q;
  // let a1 = questions.a1;
  // let a2 = questions.a2;
  // let a3 = questions.a3;
  // let a4 = questions.a4;
  // let ca = questions.ca;
  // let modules_id = req.body.data[0].modulesID;
  // let values = [q, a1, a2, a3, a4, ca, modules_id];
  // pool.connect(function (err, client, done) {
  //   if (err) {
  //     console.log("Error connecting: ", err);
  //     res.sendStatus(500);
  //   }
  //   client.query("INSERT INTO questions (question_text, type, a, b, c, d, correct, modules_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
  //     values,
  //     function (err, result) {
  //       client.end();
  //       if (err) {
  //         console.log("Error inserting data: ", err);
  //         res.sendStatus(500);
  //       } else {
  //         res.sendStatus(201);
  //       }
  //     });
  // });
});

router.get('/getEvents', function (req, res, next) {
  console.log('Inside /getEvents in moduleCreation route');
  pool.connect(function (err, client, done) {
    if (err) {
      console.log('Logging error inside /getEvents -> ', err);
      res.sendStatus(500);
    }
    client.query("SELECT * FROM history;", function (err, result) {
      client.end();
      if (err) {
        console.log('logging error inside /getEvents query -> ', err);
        res.sendStatus(500);
      } else {
        // console.log('logging result in /getEvents ', result.rows);
        res.send(result).status(200);
      }
    });
  });
});

router.get('/existingHistoricalInfo', function (req, res, next) {
  console.log('inside /existingHistoricalInfo in moduleCreation route');
  pool.connect(function (err, client, done) {
    if (err) {
      console.log("Error connecting in /existingHistoricalInfo: ", err);
      res.sendStatus(500);
    }
    // fetches all of the tags to be put into chips at historical events
    client.query("SELECT * FROM tags;", function (err, result) {
      client.end();
      if (err) {
        console.log("Error inserting data: ", err);
        res.sendStatus(500);
      } else {
        // console.log('sending results of existingHistoricalInfo GET request , ', result.rows);
        res.send(result).status(200);
      }
    });
  });
});

module.exports = router;