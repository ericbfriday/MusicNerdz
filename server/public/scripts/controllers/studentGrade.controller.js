myApp.controller('StudentGradeController', function (UserService, StudentService) {
    vm = this;
    vm.studGrades = StudentService.studGrades;
    console.log('GRADES');
   StudentService.getGrades();
});//END App Controller