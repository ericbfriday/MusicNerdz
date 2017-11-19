myApp.controller('StudentGradeController', function (UserService, StudentService) {
    const vm = this;
    // user
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

    vm.studGrades = StudentService.studGrades;
    console.log(vm.userObject);
   StudentService.getGrades();
});//END App Controller