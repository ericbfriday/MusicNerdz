myApp.controller('StudentModuleController', function (UserService, StudentService) {
    console.log('StudentModuleController created');
    //GLOBALS
    const vm = this;
    // user
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    // module
    vm.mods = StudentService.mods;
    vm.saQuestions = StudentService.saQuestions;
    vm.mcQuestions = StudentService.mcQuestions;
    vm.histEvents = StudentService.histEvents;
    vm.tags = StudentService.tags

    // constructor for quiz responses
    function QuizResps(studId, resp, questId) {
        this.studId = studId;
        this.resp = resp;
        this.questId = questId
    } //END constructor 

    // function to send responses and ids to questions in module to service
    vm.submitQuiz = function () {
        // var to hold answer objects to send to service
        let answersToSend = [];
        // obj to hold responses info
        let resps = {
            ids: [],
            resps: []
        } //END resps
        // loop through multiple choice questions
        for (let i = 0; i < vm.mcQuestions.data.length; i++) {
            // push their ids into temp obj
            resps.ids.push(vm.mcQuestions.data[i].id)
        } //END for loop
        // loop through short answer questions 
        for (let i = 0; i < vm.saQuestions.data.length; i++) {
            //push their id as well
            resps.ids.push(vm.saQuestions.data[i].id)
        } //END for loop 
        // convert object of mc responses to an array
        let mcResult = Object.keys(vm.McVal).map(function (key) {
            return vm.McVal[key];
        }); //END mcResults
        // convert object of sa responses to an array
        let saResult = Object.keys(vm.SaVal).map(function (key) {
            return vm.SaVal[key];
        }); //END sa Results
        // set responses in temp object to combined sa and mc arrays
        resps.resps = mcResult.concat(saResult);
        // loop through ids
        for (var j = 0; j < resps.ids.length; j++) {
            // make new answer objects with student id
            let answer = new QuizResps(vm.userObject.student[0].id, resps.resps[j], resps.ids[j])
            // push new objects to array
            answersToSend.push(answer);
        } //END for loop
        // CALL service submit quiz with array to send
        StudentService.submitQuiz(answersToSend);
    } //END submitQuiz

}); //END App Controller