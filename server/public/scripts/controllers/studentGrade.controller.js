myApp.controller('StudentGradeController', function (UserService, StudentService) {
    const vm = this;
    vm.studGrades = StudentService.studGrades;
    console.log('GRADES');
   StudentService.getGrades();
});//END App Controller