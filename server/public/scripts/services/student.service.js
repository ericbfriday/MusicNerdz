myApp.service('StudentService', function ($http) {
    //GLOBALS
    const sv = this
    sv.mods = {data: []}
    sv.saQuestions = {data: []};
    sv.mcQuestions = {data: []};
    sv.studGrades = {data: []};

    // constructor to create multiple choice objects
    function McQs(question, a, b, c, d, correct) {
        this.question = question;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.correct = correct;
    }//END constructor 

    //Function to get modules form server
    sv.getMod = function () {
        //Temp arrays to hold questions
        let tempSA = [];
        let tempMC = [];
        //$http get request
        $http.get('/student/getModule').then(function (resp) {
            console.log('response in service:', resp);
            // set data to global variable
            sv.mods.data = resp.data;
            // loop through response
            for (let i = 0; i < resp.data.length; i++) {
                // if the question is Short Answer
                if (resp.data[i].type === 'sa') {
                    //push it to the temp array
                    tempSA.push(resp.data[i].question);
                }//END if
                // if the question is Multiple Choice
                else if (resp.data[i].type === 'mc') {
                    // Make new McQ object from response data for mcs
                    let question = new McQs(resp.data[i].question, resp.data[i].a, resp.data[i].b, resp.data[i].c, resp.data[i].d, resp.data[i].correct);
                    // push new object into temp array
                    tempMC.push(question);
                }//END else if
            }//END for loop
            // remove duplicates from temp arrays
            let questions_without_duplicates = Array.from(new Set(tempSA));
            
            // set globals to new arrays without duplicates
            sv.saQuestions.data = questions_without_duplicates;
            sv.mcQuestions.data = tempMC
            console.log('saQs:', sv.saQuestions);
            console.log('mcQs:', sv.mcQuestions);
            console.log('Filtered:', questions_without_duplicates);
        }) //END $http GET
    } //END getMod

    // function to get student grade info back from router
   sv.getGrades = function () {
        //$http get request
        $http.get('/student/getGrades').then(function (resp) {
            console.log('response in service:', resp);
            sv.studGrades.data = resp.data
        }) //END $http GET
    }//END getGrades
    
});//END