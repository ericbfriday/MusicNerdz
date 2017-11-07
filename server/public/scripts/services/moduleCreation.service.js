myApp.service('ModuleCreation', function ($http, $mdDialog) {
    var sv = this;

    /** BEGIN HISTORICAL EVENT SECTION OF CODE */

    sv.year = {data: 2017}; // date of new event - integer to match structure of DB
    sv.dateRange = {data: []}; // date to search for existing events
    sv.description = {data: ''}; // description for new historical event
    sv.existingHistoricalEvent = {data: []}; // Existing events to be pulled from server for searching/filtering
    sv.existingHistoricalEventTags = {data: ['Event A', 'Event B']}; // existing tags to be associated with new historical event
    sv.historicalEvent = {data: ''}; // title for new historical events
    sv.historicalEventTags = {data: ['Civil Rights', 'Womens Sufferage', 'Other Topic']}; // tags for new historical event

    class Event {
        constructor(desc, year, tags) {
            this.description = desc;
            this.year = year;
            this.tags = tags;
        }
    } // end Event class

    sv.makeEvent = function (desc, year, tags) {
        console.log('sv.makeEvent activated!');
        sv.newEvent = new Event (desc, year, tags);
        return $http.post('/moduleCreation/newHistoricalInfo')
        .then((res) => {
            console.log('loggin response in makeEvent -> ', res);
        })
        .then((err)=>{
            console.log('loggin err in makeEvent -> ', err);
        });
    };

    // fetches existing historical events and tags for use searching for events
    sv.getHistoricalInfo = function() {
        console.log('sv.getHistoricalInfo activated!');
        return $http.get('/moduleCreation/existingHistoricalInfo')
        .then((res)=> {
            console.log('res in getHistoricalInfo ', res);
        }).catch((err)=>{
            console.log('catch err in getHistoricalInfo -', err);  
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
                console.log('Posted -> ', response );
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