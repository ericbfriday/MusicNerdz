'use strict';
myApp.service('StudentService', function ($http) {
    //GLOBALS
    const sv = this;
    sv.mods = {
        data: []
    };

    sv.userObject = [];

        sv.saQuestions = {
            data: []
        };
        sv.mcQuestions = {
            data: []
        };
        sv.studGrades = {
            lesson5: [],
            lesson2: []
        };
        sv.histEvents = {
            data: []
        };

    //constructor to store short answer questions
    function SaQs(question, id) {
        this.question = question;
            this.id = id
    } //END constructor 

        //constructor to create history events
        function Hist(title, desc) {
            this.title = title;
                this.desc = desc
        } //END constructor

        // function to remove duplicates
        function removeDupes(originalArray, objKey) {
            // local variables
            let trimmedArray = [];
            let values = [];
            let value;
            // loop through array
            for (let i = 0; i < originalArray.length; i++) {
                // set value to object key
                value = originalArray[i][objKey];
                if (values.indexOf(value) === -1) {
                    // push to trimmedArray to hold
                    trimmedArray.push(originalArray[i]);
                    // push key value to values array
                    values.push(value);
                } //END if
            } //END for loop
            // return array without duplicates
            return trimmedArray;
        } //END removeDuplicates

        // function to get student grade info back from router
        sv.getGrades = function () {
            //temp arrays to hold grades for each module
            let tempLesson5 = [];
            let tempLesson2 = [];
            //$http get request
            $http.get('/student/getGrades').then(function (resp) {
                    console.log('response in service:', resp);
                    // sv.studGrades.data = resp.data loop though response
                    for (let i = 0; i < resp.data.length; i++) {
                        if (resp.data[i].modules_id === 5) {
                            tempLesson5.push(resp.data[i] //END if
                            );
                        } else if (resp.data[i].modules_id === 2) {
                            tempLesson2.push(resp.data[i]);
                        } //END else if
                    } //END for loop
                })// END $http.then
            }//END getGrades

    //Function to get modules form server
    sv.getMod = function (id) {
        //Temp arrays to hold questions
        console.log("module ID: ", id);
        let tempSA = [];
        let tempMC = [];
        let tempHist = [];
        console.log(id);
        
        // GET request
        $http.get('/student/mod/'+id).then(function (resp) {
            console.log('response in service:', resp);
            // set data to global variable
            sv.mods.data = resp.data;
            // loop through response
            for (let i = 0; i < resp.data.length; i++) {
                // make history events objects and store in local array
                let event = new Hist(resp.data[i].history_title, resp.data[i].history_desc);
                tempHist.push(event);
                // if the question is Short Answer
                if (resp.data[i].type === 'sa') {
                    // Make new SaQ object from response data for sas
                    let saQuestion = new SaQs(resp.data[i].question, resp.data[i].id)
                    //push it to the temp array
                    tempSA.push(saQuestion);
                } //END if
                // if the question is Multiple Choice
                else if (resp.data[i].type === 'mc') {
                    // Make new McQ object from response data for mcs
                    let question = new McQs(resp.data[i].question, resp.data[i].a, resp.data[i].b, resp.data[i].c, resp.data[i].d, resp.data[i].correct, resp.data[i].id);
                    // push new object into temp array
                    tempMC.push(question);
                } //END else if
            } //END for loop
            // set globals to value of return from function without duplicates
            sv.mcQuestions.data = removeDupes(tempMC, 'question');
            sv.histEvents.data = removeDupes(tempHist, 'title');
            sv.saQuestions.data = removeDupes(tempSA, 'question')
        }) //END $http.then
    } //END getMod

    // function to get student grade info back from router
    sv.getGrades = function () {
        //temp arrays to hold grades for each module
        let tempLesson5 = [];
        let tempLesson2 = [];
        //$http get request
        $http
            .get('/student/getGrades')
            .then(function (resp) {
                console.log('response in service:', resp);
                // sv.studGrades.data = resp.data loop though response
                for (let i = 0; i < resp.data.length; i++) {
                    if (resp.data[i].modules_id === 5) {
                        tempLesson5.push(resp.data[i] //END if
                        );
                    } else if (resp.data[i].modules_id === 2) {
                        tempLesson2.push(resp.data[i]);
                    } //END else if
                } //END for loop

                //Function to get modules form server
                sv.getMod = function () {
                    //Temp arrays to hold questions
                    let tempSA = [];
                    let tempMC = [];
                    let tempHist = [];
                    // GET request
                    $http.get('/student/getModule').then(function (resp) {
                        console.log('response in service:', resp);
                        // set data to global variable
                        sv.mods.data = resp.data;
                        // loop through response
                        for (let i = 0; i < resp.data.length; i++) {
                            // make history events objects and store in local array
                            let event = new Hist(resp.data[i].history_title, resp.data[i].history_desc);
                            tempHist.push(event);
                            // if the question is Short Answer
                            if (resp.data[i].type === 'sa') {
                                // Make new SaQ object from response data for sas
                                let saQuestion = new SaQs(resp.data[i].question, resp.data[i].id)
                                //push it to the temp array
                                tempSA.push(saQuestion);
                            } //END if
                            // if the question is Multiple Choice
                            else if (resp.data[i].type === 'mc') {
                                // Make new McQ object from response data for mcs
                                let question = new McQs(resp.data[i].question, resp.data[i].a, resp.data[i].b, resp.data[i].c, resp.data[i].d, resp.data[i].correct, resp.data[i].id);
                                // push new object into temp array
                                tempMC.push(question);
                            } //END else if
                        } //END for loop
                        // set globals to value of return from function without duplicates
                        sv.mcQuestions.data = removeDupes(tempMC, 'question');
                        sv.histEvents.data = removeDupes(tempHist, 'title');
                        sv.saQuestions.data = removeDupes(tempSA, 'question')
                    }); //END $http.then
                }; //END getMod

                // function to get student grades info back from router
                sv.getGrades = function () {
                    //temp arrays to hold grades for each module
                    let tempLesson5 = [];
                    let tempLesson2 = [];
                    // GET request
                    $http.get('/student/getGrades').then(function (resp) {
                        console.log('response in service:', resp);
                        // loop though response
                        for (let i = 0; i < resp.data.length; i++) {
                            if (resp.data[i].modules_id === 5) {
                                tempLesson5.push(resp.data[i]);
                            } //END if
                            else if (resp.data[i].modules_id === 2) {
                                tempLesson2.push(resp.data[i]);
                            } //END else if
                        } //END for loop
                    }); //END $http.then
                    sv.studGrades.lesson5 = tempLesson5;
                    sv.studGrades.lesson2 = tempLesson2;
                    console.log('studGRADES:', sv.studGrades);
                }; //END getGrades

                // function to send quiz responses to server -> DB
                sv.submitQuiz = function (resps) {
                    console.log(resps);
                    // POST request
                    $http({
                        method: 'POST',
                        url: '/student/quiz',
                        data: resps
                    }).then(function (response) {
                        console.log('GET response:', response);
                    }); //END $http.then
                }; //END submitQuiz
            });
    };
});