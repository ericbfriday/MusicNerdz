myApp.controller('TeacherGradeController', function ($http, TeacherService) {
    console.log('TeacherGradeController created');
    var vm = this;
    vm.teacherService = TeacherService;
    vm.userObject = TeacherService.userObject;
});