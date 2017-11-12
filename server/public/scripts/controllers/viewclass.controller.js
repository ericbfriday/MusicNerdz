myApp.controller('ViewController', function ($http, TeacherService) {
    console.log('ViewController created');
    var vm = this;
    vm.teacherService = TeacherService;
    vm.userObject = TeacherService.userObject;

    //just for testing
    vm.teacher = '12';

    function Class (id, title, code) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.students = [];
    };

    function Student (first, last, email) {
        this.first = first;
        this.last = last;
        this.email = email;
    };

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
        teachersId: vm.teacher
    }

    vm.classes = [];

    //add class
    vm.addClass = function () {
        console.log('in add class', vm.class);
        TeacherService.addClass(vm.class).then( function() {
            console.log('addClass function after .then');
            vm.classes = [];
            vm.getClasses(vm.teacher);
        })

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
    vm.getClasses = function (teacherId) {
        TeacherService.getClasses(teacherId).then( function () {
            vm.returnedClasses = vm.teacherService.classes;
            var classMap = {};
            for (var i = 0; i < vm.returnedClasses.length; i++) {
                var classId = vm.returnedClasses[i].id;
                var title = vm.returnedClasses[i].title;
                var code = vm.returnedClasses[i].code;
                var first = vm.returnedClasses[i].first;
                var last = vm.returnedClasses[i].last;
                var email = vm.returnedClasses[i].email;

                var newStudent = new Student(first, last, email);
                
                var classObj = classMap[classId];

                if (classObj == null) {
                    var newClass = new Class(classId, title, code);
                    classMap[classId] = newClass;                    
                    newClass.students.push(newStudent);
                    vm.classes.push(newClass);
                } else {
                    newClass.students.push(newStudent);
                };  
            };
            console.log('class and students after GET', vm.classes);            
        });
    };

    //connect to service to make http call to get students by class
    vm.getStudents = function (classId) {
        console.log('in get students with class ID', classId);
        TeacherService.getStudents(classId).then( function () {
            vm.students = vm.teacherService.students;
            console.log('students array after GET', vm.students);            
        })
    };
    
    console.log("vm.student", vm.student);
});
