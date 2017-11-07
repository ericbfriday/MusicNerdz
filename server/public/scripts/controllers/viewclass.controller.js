myApp.controller('ViewController', function ($http, UserService) {
    console.log('ViewController created');
    var vm = this;
    vm.userService = UserService;

    //Misc classes fo testing
    vm.class1 = {
        name: 'firstHour',
        classId: '1'
    };

    vm.class2 = {
        name: 'secondHour',
        classId: '2'
    };

    vm.student = {
        first: '',
        last: '',
        email: '',
        number: '',
        classId: '',
        teachersId: '1'
    }

    vm.classes = [vm.class1, vm.class2];

    //send student info to server for addition to db
    vm.addStudent = function (classinfo) {
        vm.student.classId = classinfo;
        console.log("vm.student", vm.student);
        if (vm.student.email === '' || vm.student.number === '') {
            vm.message = "Please complete all fields!";
          } else {
            console.log('ViewController -- addStudent -- sending to server...', vm.student);
            return $http
              .post('/student/addStudent', vm.student)
              .then(function (response) {
                console.log('LoginController -- registerUser -- success');
                // $location.path('/home');
              })
              .catch(function (response) {
                console.log('LoginController -- registerUser -- error');
                vm.message = "Please try again.";
              });
          }
    };
    console.log("vm.student", vm.student);
});
