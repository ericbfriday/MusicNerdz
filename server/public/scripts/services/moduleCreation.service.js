myApp.service('ModuleCreation', function ($http, $mdDialog) {
    var sv = this;

    /**BEGIN SONG CREATION SECTION OF CODE */

    class Song {
        constructor (songTitle, songAlbum, songArtist, songYear, songURL, songArt, songDesc, songLyrics){
            this.songTitle = songTitle.data;
            this.songAlbum = songAlbum.data;
            this.songArtist = songArtist.data;
            this.songYear = songYear.data;
            this.songURL = songURL.data;
            this.songDesc = songDesc.data;
            this.songLyrics = songLyrics.data;
            this.songArt = songArt.data;
        }
    }

    sv.songTitle = {data: ''};
    sv.songAlbum = {data: ''};
    sv.songArtist = {data: ''};
    sv.songYear = {data: 2017};
    sv.songURL = {data: ''};
    sv.songDesc = {data: ''};
    sv.songLyrics = {data: ''};
    sv.songArt = {data: ''};

    sv.makeSong = function(songTitle, songAlbum, songArtist, songYear, songURL, songArt, songDesc, songLyrics) {
        sv.song = new Song(songTitle, songAlbum, songArtist, songYear, songURL, songArt, songDesc, songLyrics);
        return $http.post('/moduleCreation/songCreation', sv.song)
        .then((response) => {
            console.log('logging response in makeSong -> ', response);
        })
        .catch((e)=>{
            console.log('Logging error in makeSong -> ', e);
        });
    };

    /** END SONG CREATION SECTION OF CODE */

    /** BEGIN HISTORICAL EVENT SECTION OF CODE */

    sv.year = {data: 2017}; // date of new event - integer to match structure of DB
    sv.title = {data: ''};
    sv.desc = {data: ''}; // description for new historical event
    sv.hTags = {data: []}; // tags for new historical event
    sv.existingHistoricalEvent = {data: []}; // Existing events to be pulled from server for searching/filtering
    sv.existingHistoricalEventTags = {data: []}; // existing tags to be associated with new historical event. Is this necessary?
    sv.selectedItem = null;
    sv.searchText = null;
    sv.querySearch = querySearch;
    sv.requireMatch = false; // temporarily 'true' until route set up to allow insertion and association of new tags
    sv.transformChip = transformChip;
    sv.tags = [];

    class Event {
        constructor(title, desc, year, htags) {
            this.title = title;
            this.desc = desc;
            this.year = year;
            this.hTags = htags; // hTags are the tags assigned to an event by the user.
        }
    } // end Event class

    sv.makeEvent = function (title, desc, year, hTags) {
        console.log('sv.makeEvent activated!');
        sv.newEvent = new Event(title, desc, year, hTags);
        return $http.post('/moduleCreation/newHistoricalEvent', sv.newEvent)
            .then( function (res) {
                console.log('loggin res status in makeEvent -> ', res);
            })
            .catch( function (err) {
                console.log('loggin err msg in makeEvent -> ', err);
            });
    };

    // On load, fetches existing historical events and tags for use searching for events
    sv.getHistoricalInfo = function () {
        console.log('sv.getHistoricalInfo activated!');
        return $http.get('/moduleCreation/existingHistoricalInfo')
            .then( function (res) {
                sv.existingHistoricalEventTags.data = res.data.rows; // associates tags to variable for chip manipulation
                // console.log('sv.existingHistoricalEventTags -> ', sv.existingHistoricalEventTags.data);
                sv.loadTags(); // calls tags for association to chips
            }).catch( function (err) {
                console.log('catch err in getHistoricalInfo -', err);
            });
    };

    function transformChip (chip) { // Used for chip functionality
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }
        // Otherwise, create a new one
        return {
            name: chip,
            type: 'new' // THIS RETURN OF TYPE: 'NEW' IS CURRENTLY CAUSING CONFUSION/CONFLICT WITH 
                        // MAP FUNCTION. THIS IS BECAUSE ALL ISSUES ARE CURRENTLY LABELLED AS 'TYPE'
                        // IN THE DB. MUST ADDRESS GOING FORWARD.
        };
    }

    function querySearch (query) { // Used for chip functionality
        // console.log('in querySearch', query);
        // console.log('loggin sv.tags -> ', sv.tags);
        var results = query ? sv.tags.filter(createFilterFor(query)) : [];
        return results;
    }

    function createFilterFor (query) { // Used for chip functionality
        var lowercaseQuery = angular.lowercase(query);
        // console.log('logging lowercaseQuery -> ', lowercaseQuery);
        return function filterFn (tag) {
            return (tag._lowertype.indexOf(lowercaseQuery) === 0);
        };
    }

    sv.loadTags = function () { // Used for chip functionality
        sv.tags = sv.existingHistoricalEventTags.data;
        // console.log('tags ', sv.tags);

        return sv.tags.map(function (tag) {
            tag._lowertype = tag.type.toLowerCase();
            tag.name = tag.type;    // ONLY NEEDED BECAUSE THE transformChip() CURRENTLY ASSIGNS TYPE 'NEW'
                                    // TO ALL USER-CREATED CHIPS. MUST ADDRESS GOING FORWARD.
            // console.log('mapped tags', tag);
            return tag;
        });
    };
    /** END HISTORICAL EVENT SECTION OF CODE */

    /* BEGIN QUIZ GENERATION SECTION OF CODE */
    // Code Readability notes:
    // q = question
    // a = answer
    // sa = short answer
    // mc = multiple choice
    // ca = correct answer (for multiple choice)
    // e = essay (like SA, but longer char limit)

    sv.quiz = {data: []};
    sv.currentQType = '';
    sv.questions = []; // holds questions to push into quiz
    sv.currentMCQ = ''; // MC Question
    sv.currentMCA1 = ''; // MC Answers 1-4 below
    sv.currentMCA2 = '';
    sv.currentMCA3 = '';
    sv.currentMCA4 = '';
    sv.currentMCCA = ''; // MCCA = Multiple Choice Correct Answer
    sv.currentSAQ = ''; // SA Question
    sv.currentSAA = ''; // SA Answer/hints to grade on
    sv.currentEQ = ''; // Essay Question/Topic
    sv.currentEA = ''; // Essay Answer/hints to grade on

    // classes are created above functions, as functions contain variables referencing classes, and classes do not get hoisted.

    // establishes structure for multiple choice question to be inserted into questions array
    class MCQuestion {
        constructor(q, a1, a2, a3, a4, ca) {
            this.q = q;
            this.a1 = a1;
            this.a2 = a2;
            this.a3 = a3;
            this.a4 = a4;
            this.ca = ca; // ca = correct answer
            this.type = 'mc';
        }
    } // end MCQuestion class

    // establishes structure for SA Q to be inserted into Q array
    class ShortAnsQuestion {
        constructor(q, a) { // q = question, a = answer
            this.q = q;
            this.a = a;
            this.type = 'sa'; // sa = short answer
        }
    } // end ShortAnsQuestion Class

    // establishes structure for essay class Qs to be pushed into Q array
    class Essay {
        constructor(q, a) {
            this.q = q;
            this.a = a;
            this.type = 'essay';
        }
    } // end Essay class

    // creates overarching 'quiz' item which holds questions.
    // entire 'quiz'will be sent to backend for insertion into DB.
    class Quiz {
        constructor(q) {
            this.questions = q; // questions will be a class of either multiple choice, short answer, or essay. 
            // questions will be an array of objects of the above questions.
        }
    } // end Quiz class

    // pushes MC Q into Q array
    sv.pushMCQ = function (q, a1, a2, a3, a4, ca) {
        sv.newMCQ = new MCQuestion(q, a1, a2, a3, a4, ca);
        sv.questions.push(sv.newMCQ);
        console.log('loggin sv.newMCQ in pushMCQuestion -> ', sv.newMCQ);

        // Attempt to clear the form for the next questions submission
        sv.currentMCQ = ''; // MC Question
        sv.currentMCA1 = ''; // MC Answers 1-4 below
        sv.currentMCA2 = '';
        sv.currentMCA3 = '';
        sv.currentMCA4 = '';
        sv.currentMCCA = ''; // MCCA = Multiple Choice Correct Answer
    }; // end pushMCQ function

    // pushes SA Q into Q array
    sv.pushSAQ = function (q, a) {
        sv.newSAQuestion = new ShortAnsQuestion(q, a);
        sv.questions.push(sv.newSAQuestion);
        console.log('logging sv.newSAQuestion in pushShortAnsQuestion -> ', sv.newSAQuestion);

        // Attempt to clear SA fields
        sv.currentSAQ = ''; // SA Question
        sv.currentSAA = ''; // SA Answer/hints to grade on
    }; // end pushSAQ function

    // pushes Essay question into Q array
    sv.pushEssayQ = function (q, a) {
        sv.newEQ = new Essay(q, a);
        sv.questions.push(sv.newEQ);
        console.log('logging sv.newEQ in pushEssayQ -> ', sv.newEQ);

        // Attempt to clear Essay fields
        sv.currentEQ = ''; // Essay Question/Topic
        sv.currentEA = ''; // Essay Answer/hints to grade on
    }; // end pushEssayQ function

    // creates quiz object using questions array.
    // POST calls to router with quiz object. Response logged and quiz array reset to 0;
    sv.pushToQuiz = function (q) {
        sv.newQuiz = new Quiz(q);
        sv.quiz.data.push(sv.newQuiz);
        console.log('logging sv.newQuiz in pushToquiz => ', sv.newQuiz);
        return $http.post('/moduleCreation/quiz', sv.quiz)
            .then((response) => {
                console.log('Posted -> ', response);
                sv.quiz.data.length = 0; // empties quiz item
            })
            .catch((e) => {
                console.log('logging catch error in sv.pushToQuiz', e);
            });
    }; // end pushToQuiz function

    // confirm functionality for submit of form
    sv.showConfirm = function (ev) {
        sv.status = ''; // status of submission to log if submission is declined.
        var confirm = $mdDialog.confirm()
            .title('Confirm Quiz Submission')
            .textContent('Do you wish to submit this quiz? Quizzes are unable to be edited after submission.')
            .ariaLabel('Confirm you wish to submit the quiz.')
            .targetEvent(ev)
            .ok('YES')
            .cancel('NO');
        $mdDialog.show(confirm).then(function () { // following script runs if 'yes' is selected.
            sv.status = 'Form submitted.';
            sv.pushToQuiz(sv.questions);
        }, function () { // status updated and logged if form is not submitted.
            sv.status = 'Form not submitted.';
            console.log(sv.status);
        });
    };
});