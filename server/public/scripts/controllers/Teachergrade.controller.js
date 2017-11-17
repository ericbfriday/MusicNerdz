myApp
.controller('TeachergradeController', function (UserService, StudentService) {
  console.log('TeachergradeController created');
  var vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.studentService = StudentService;



});