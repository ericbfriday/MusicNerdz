myApp.controller('StudentModuleController', function (UserService, StudentService) {
    console.log('StudentModuleController created');
    var vm = this;
    vm.video1 = 'https://www.youtube.com/watch?v=N0DcVbSYWUA';
    vm.userService = UserService;
    vm.mods = StudentService.mods;
    vm.studentService = StudentService;

    StudentService.getMod();
    console.log('resp in controller:');

    // StudentService.feedbackFunc();
    console.log('feedback in controller:');
    
});//END App Controller