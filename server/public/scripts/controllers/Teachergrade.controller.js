'use strict';
myApp.controller('TeachergradeController', function ($http, $location, UserService, StudentService, TeacherService) {

  const vm = this;
  vm.userService = UserService;
  vm.userObject = UserService.userObject;
  vm.studentService = StudentService;
  vm.teacherService = TeacherService;
  vm.stdRsps = TeacherService.stdRsps;
  vm.teacherFinalGrade = null;
  console.log('stdRsps:', vm.stdRsps);
  console.log('userObject:', vm.userObject);

  vm.relocate = function () {
    $location.path("/teacher/grading");
  };

  vm.submitGrading = function (userObject) {
    console.log('logging submitGrading userObject & teacherFinalGrade -> ', userObject);
    // Could also be written as a PUT, however because it's transmitting student grades I'm sending
    // as a POST to encrypt data.
    $http.post('/teacher/gradedQuiz', userObject)
      .then((response) => {
        console.log('Logging response in teachergrade controller submitGrading -> ', response);
      })
      .catch((error) => {
        console.log('Logging error in teachergrade controller submitGrading -> ', error);
      }); // end POST
  }; // end submitGrading

  // changes 'final_grade' attribute of each response to match teacher's final grade.
  // Then feeds userObject (which contains teacher's notes and final_grade) into submitGrading function.
  vm.finalGradeConverter = function (userObject, teacherFinalGrade) {
    console.log('converting final grades');
    userObject.studentinfo.forEach(ele => {
      ele.final_grade = teacherFinalGrade;
    });
    console.log('logging userObject after final grade conversion -> ', userObject.studentinfo);
    vm.submitGrading(userObject);
  };

});