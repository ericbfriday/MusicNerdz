'use strict';

myApp
.controller('TeachergradeController', function ($http, UserService, StudentService, TeacherService) {
  console.log('TeachergradeController created');
  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.studentService = StudentService;
  vm.teacherService = TeacherService;
  vm.stdRsps = TeacherService.stdRsps; 
  console.log('stdRsps:', vm.stdRsps);
  console.log('userObject:', vm.userObject);




});