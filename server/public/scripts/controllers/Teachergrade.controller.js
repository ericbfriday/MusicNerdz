myApp
.controller('TeachergradeController', function (UserService, StudentService, $location) {
  console.log('TeachergradeController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.studentService = StudentService;

  vm.relocate = function () {
    $location.path("/teacher/grading");
    };

});