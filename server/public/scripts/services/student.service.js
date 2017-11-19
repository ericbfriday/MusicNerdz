myApp.service('StudentService', function ($http, UserService) {
    //GLOBALS
    const sv = this;
    sv.userObject = UserService.userObject;
    sv.mods = {
        data: []
    };
    sv.saQuestions = {
        data: []
    };
    sv.mcQuestions = {
        data: []
    };
    sv.essayQuestions = {
        data: []
    };
    sv.studGrades = {
        lesson5: [],
        lesson2: []
    };
    sv.histEvents = {
        data: []
    };
    sv.tags = {
        data: []
    }
    sv.addResources = {
        video: [],
        news: [],
        blog: [],
        other: []
    }

    //constructor to store short answer questions
    function SaQs(question, id) {
        this.question = question;
        this.id = id
    } //END constructor 

    //constructor to store essay questions
    function EssayQs(question, id) {
        this.question = question;
        this.id = id
    } //END constructor 

    // constructor to create multiple choice objects
    function McQs(question, a, b, c, d, correct, id) {
        this.question = question;
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.correct = correct;
        this.id = id
    } //END constructor

    //constructor to create history events
    function Hist(title, desc) {
        this.title = title;
        this.desc = desc
    } //END constructor

    //constructor to create additional resources 
    function addContent (title, desc, type, link) {
        this.title = title;
        this.desc = desc;
        this.type = type;
        this.link = link
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

    //Function to get modules form server
    sv.getMod = function (id) {
        //Temp arrays to hold questions, history and tags
        let tempSA = [];
        let tempMC = [];
        let tempEssay = [];
        let tempHist = [];
        let tempTags = [];
        let tempResVid = [];
        let tempResNews = [];
        let tempResBlog = [];
        let tempResOth = [];
        console.log(id);
        // GET request
        $http.get('/student/mod/' + id).then(function (resp) {
            console.log('response in service:', resp);
            // set data to global variable
            sv.mods.data = resp.data;
            // loop through response
            for (let i = 0; i < resp.data.length; i++) {
                // make history events objects and store in local array
                let event = new Hist(resp.data[i].history_title, resp.data[i].history_desc);
                tempHist.push(event);
                // push tags into temp array
                tempTags.push(resp.data[i].tag_type);
                // if the question is Short Answer
                if (resp.data[i].type === 'sa') {
                    // Make new SaQ object from response data for sas
                    let saQuestion = new SaQs(resp.data[i].question, resp.data[i].id)
                    //push it to the temp array
                    tempSA.push(saQuestion);
                } //END if
                // if the question is Essay
                if (resp.data[i].type === 'essay') {
                    // Make new SaQ object from response data for sas
                    let essayQuestion = new EssayQs(resp.data[i].question, resp.data[i].id)
                    //push it to the temp array
                    tempEssay.push(essayQuestion);
                } //END if
                // if the question is Multiple Choice
                else if (resp.data[i].type === 'mc') {
                    // Make new McQ object from response data for mcs
                    let question = new McQs(resp.data[i].question, resp.data[i].a, resp.data[i].b, resp.data[i].c, resp.data[i].d, resp.data[i].correct, resp.data[i].id);
                    // push new object into temp array
                    tempMC.push(question);
                } //END else if
                if (resp.data[i].res_type === 'v') {
                    let resource = new addContent(resp.data[i].res_title, resp.data[i].res_desc, resp.data[i].res_type, resp.data[i].link);
                    tempResVid.push(resource);   
                }//END if video
                else if (resp.data[i].res_type === 'na') {
                    let resource = new addContent(resp.data[i].res_title, resp.data[i].res_desc, resp.data[i].res_type, resp.data[i].link);
                    tempResNews.push(resource);
                }//END else if news article 
                else if (resp.data[i].res_type === 'bp') {
                    let resource = new addContent(resp.data[i].res_title, resp.data[i].res_desc, resp.data[i].res_type, resp.data[i].link);
                    tempResBlog.push(resource);
                }//END else if blog post
                else {
                    let resource = new addContent(resp.data[i].res_title, resp.data[i].res_desc, resp.data[i].res_type, resp.data[i].link);
                    tempResOth.push(resource);
                }// END else other
            } //END for loop
            // remove dupes from array of tags
            let tags_without_duplicates = Array.from(new Set(tempTags))
            // set globals to value of return from function without duplicates
            sv.tags.data = tags_without_duplicates
            sv.mcQuestions.data = removeDupes(tempMC, 'question');
            sv.histEvents.data = removeDupes(tempHist, 'title');
            sv.addResources.video = removeDupes(tempResVid, 'title');
            sv.addResources.news = removeDupes(tempResNews, 'title');
            sv.addResources.blog = removeDupes(tempResBlog, 'title');
            sv.addResources.other = removeDupes(tempResOth, 'title');
            sv.saQuestions.data = removeDupes(tempSA, 'question');
            sv.essayQuestions.data = removeDupes(tempEssay, 'question');
            console.log('resources', sv.addResources);
            
        }) //END $http.then
    } //END getMod

    // function to get student grades info back from router
    sv.getGrades = function () {
        //temp arrays to hold grades for each module
        let tempLesson5 = [];
        let tempLesson2 = [];
        // let id = sv.userObject.student[0].id;
        // GET request
        $http.get('/student/getGrades/').then(function (resp) {
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
    sv.submitQuiz = function (resps) {
        objectToSend = {
            data: resps
        }//END objectToSend
        // POST request
        $http({
            method: 'POST',
            url: '/student/quiz',
            data: objectToSend
        }).then(function (response) {
            console.log('posted');
        }) //END $http.then
    } //END submitQuiz
    // console.log('USER', sv.userObject.student[0].id);

}); //END service