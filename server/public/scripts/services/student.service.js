myApp.service('StudentService', function ($http) {
    const sv = this
    sv.mods = {data: []}
    sv.saQuestions = {data: []};
    sv.mcQuestions = {data: []};

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
            // remove duplicates from temp array
            let questions_without_duplicates = Array.from(new Set(tempSA));
            // remove duplicates from array of objects (tempMC)
            function removeDuplicates(originalArray, objKey) {
                // local variables
                let trimmedArray = [];
                let values = [];
                let value;
                // loop through array of mcs
                for (let i = 0; i < originalArray.length; i++) {
                    // set value to object key
                    value = originalArray[i][objKey];
                    if (values.indexOf(value) === -1) {
                        // push to trimmedArray to hold
                        trimmedArray.push(originalArray[i]);
                        // push key value to values array
                        values.push(value);
                    }//END if
                }//END for loop
                // return array without duplicates
                return trimmedArray;
            }//END removeDuplicates
            // set globals to new arrays without duplicates
            sv.saQuestions.data = questions_without_duplicates;
            // set to value of return from function
            sv.mcQuestions.data = removeDuplicates(tempMC, 'question');
            console.log('saQs:', sv.saQuestions);
            console.log('mcQs:', sv.mcQuestions.data);
            console.log('Filtered:', questions_without_duplicates);
        }) //END $http GET
    } //END getListings
    
});//END