myApp.service('StudentService', function ($http) {
    //GLOBALS
    const sv = this;
    sv.mods = {
        data: []
    };

        sv.userObject=[];

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

    //constructor to store short answer questions
    function SaQs(question, id) {
        this.question = question,
            this.id = id
    } //END constructor 
    
        // constructor to create multiple choice objects
        function McQs(question, a, b, c, d, correct) {
            this.question = question;
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.correct = correct;
        } //END constructor

        //Function to get modules form server
        sv.getMod = function (id) {
            //Temp arrays to hold questions
            console.log("module ID: ", id);
            let tempSA = [];
            let tempMC = [];
            //$http get request
            $http
                .get('/student/mod/'+id)
                .then(function (resp) {
                    console.log('response in service:', resp);
                    // set data to global variable
                    sv.mods.data = resp.data;
                    // loop through response
                    for (let i = 0; i < resp.data.length; i++) {
                        // if the question is Short Answer
                        if (resp.data[i].type === 'sa') {
                            //push it to the temp array
                            tempSA.push(resp.data[i].question); //END if
                            // if the question is Multiple Choice;
                        } else if (resp.data[i].type === 'mc') {
                            // Make new McQ object from response data for mcs
                            let question = new McQs(resp.data[i].question, resp.data[i].a, resp.data[i].b, resp.data[i].c, resp.data[i].d, resp.data[i].correct);
                            // push new object into temp array
                            tempMC.push(question);
                        } //END else if
                    } //END for loop
                    // remove duplicates from temp arrays
                    let questions_without_duplicates = Array.from(new Set(tempSA));
                    // set globals to new arrays without duplicates
                    sv.saQuestions.data = questions_without_duplicates;

                    sv.mcQuestions.data = tempMC;
                    console.log('saQs:', sv.saQuestions);
                    console.log('mcQs:', sv.mcQuestions);
                    console.log('Filtered:', questions_without_duplicates);
                }); //END $http GET
        }; //END getMod

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
        }) //END $http.then
    } //END getMod

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
        }) //END $http.then
        sv.studGrades.lesson5 = tempLesson5;
        sv.studGrades.lesson2 = tempLesson2;
        console.log('studGRADES:', sv.studGrades);
    }; //END getGrades

    // function to send quiz responses to server -> DB
    sv.submitQuiz = function ( resps ) {
        console.log(resps );
        // POST request
        $http({
            method: 'POST',
            url: '/student/quiz',
            data: resps
        }).then(function (response) {
            console.log('GET response:', response);
        })//END $http.then
    }//END submitQuiz

}); //END service
