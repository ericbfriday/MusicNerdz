
myApp.controller('ViewController', function ($http, TeacherService, UserService) {
    console.log('ViewController created');
    var vm = this;
    vm.teacherService = TeacherService;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    console.log('user object from theacher service', vm.userObject);

    //current teacher user for selecting classes and students
    vm.teacher = vm.userObject.user.teachers_id;
    vm.classes = vm.teacherService.classes;
    vm.modules = vm.teacherService.modules;

    //create new class data
    vm.class = {
        id: '',
            title: '',
            code: '',
            teachersId: vm.teacher
    };

    //create new student data
    vm.student = {
        first: '',
        last: '',
        email: '',
        number: '',
        classesId: '',
        teachersId: vm.teacher,
        // studentId: vm.student //?
    };

    

    //add class
    vm.addClass = function () {
        console.log('in add class', vm.class);
        TeacherService.addClass(vm.class).then(function () {
            console.log('addClass function after .then');
            vm.classes = [];
            vm.getClasses(vm.teacher);
        });

    };

    //send student info to server for addition to db
    vm.addStudent = function (classId) {
        console.log(classId);
        vm.student.classesId = classId;
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

    //retrieve class list from db by teacher
    vm.getClasses = vm.teacherService.getClasses;
  
    //call get assigned modules from service
    vm.getAssigned = vm.teacherService.getAssigned;
        
    //connect to service to make http call to get students by class
    vm.getStudents = function (classId) {
        console.log('in get students with class ID', classId);
        TeacherService.getStudents(classId).then(function () {
            vm.students = vm.teacherService.students;
            console.log('students array after GET', vm.students);
        })
    };

    // vm.deleteStudent = TeacherService.deleteStudent;
    // vm.deleteClass = TeacherService.deleteClass;

    vm.deleteClass = function (classId) {
        console.log('in delete class with classId:', classId);
        TeacherService.deleteClass(classId).then(function () {
            vm.getClasses(vm.teacher);
            console.log('classes after delete:', vm.classes);
        })
    } // end deleteClass

    vm.deleteStudent = function (classId, stud_id) {
        console.log('in delete student with classId & stud_id:',classId, stud_id);
        TeacherService.deleteStudent(stud_id).then(function () {
            vm.getStudents(classId);
        })
    }

    console.log("vm.student", vm.student);
});