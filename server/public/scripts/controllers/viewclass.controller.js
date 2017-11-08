myApp.controller('ViewController', function ($http, TeacherService) {
    console.log('ViewController created');
    var vm = this;
    vm.teacherService = TeacherService;

    //Misc classes for testing
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

    vm.students = [];

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

    //connect to service to make http call to get students by class
    vm.getStudents = function (classId) {
        console.log('in get students with class ID', classId);
        TeacherService.getStudents(classId).then( function () {
            vm.students = vm.teacherService.students;
            console.log('students array after GET', vm.students);            
        })
    };

    vm.getStudents(vm.class1.classId);
    console.log("vm.student", vm.student);
});
