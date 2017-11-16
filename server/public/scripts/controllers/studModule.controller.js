myApp.controller('StudentModuleController', function (UserService, StudentService) {
    console.log('StudentModuleController created');
    var vm = this;
    vm.userService = UserService;
    vm.mods = StudentService.mods;
    vm.saQuestions = StudentService.saQuestions;
    vm.mcQuestions = StudentService.mcQuestions;
    vm.histEvents = StudentService.histEvents;

    vm.submitQuiz = function () {
     console.log(vm.McVal);
     console.log(vm.SaVal);
     
    };//END submitQuiz
 
        
});//END App Controller