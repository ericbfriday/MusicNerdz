myApp.controller('StudentModuleController', function (UserService, StudentService) {
    console.log('StudentModuleController created');
    const vm = this;
    vm.userService = UserService;
    vm.mods = StudentService.mods;
    vm.saQuestions = StudentService.saQuestions;
    vm.mcQuestions = StudentService.mcQuestions;
    vm.histEvents = StudentService.histEvents;

    // function to send responses and ids to questions in module to service
    vm.submitQuiz = function () {
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
        // CALL service submit quiz with resp object
        StudentService.submitQuiz(resps);
        console.log(id);
        console.log(mcQuest.id);
    } //END submitQuiz

    //CALL getMod on page load
    StudentService.getMod();
}); //END App Controller
