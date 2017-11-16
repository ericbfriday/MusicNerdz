
myApp.controller('ViewController', function ($http, TeacherService, UserService) {
    console.log('ViewController created');
    var vm = this;
    vm.teacherService = TeacherService;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    console.log('user object from theacher service', vm.userObject);

    //current teacher user for selecting classes and students
    vm.teacher = vm.userObject.user.teachers_id;

    function Class (id, title, code) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.students = [];
    };

    function Student (studId, first, last, email) {
        this.studId = studId;
        this.first = first;
        this.last = last;
        this.email = email;
        this.id = studId;
    };

    function StudentGrade (studentId, final, response) {
        this.studId = studentId;
        this.final = final;
        this.response = response;
    }

    function ModTitleId (id, title) {
        this.id = id;
        this.title = title;
        this.studGrades = [];
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
        teachersId: vm.teacher,
        // studentId: vm.student //?
    }

    vm.classes = [];
    vm.modules = [];

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
                var classId = vm.returnedClasses[i].classid;
                var title = vm.returnedClasses[i].title;
                var code = vm.returnedClasses[i].code;
                var first = vm.returnedClasses[i].first;
                var last = vm.returnedClasses[i].last;
                var email = vm.returnedClasses[i].email;
                var studId = vm.returnedClasses[i].studid;

                var newStudent = new Student(studId, first, last, email);
                
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
    
    //call get assigned modules from service
    vm.getAssigned = function (classId) {
        console.log('in get assigned in teacher controller', classId);
        TeacherService.getAssigned(classId).then( function () {
            console.log('back from service with', vm.teacherService.assigned);
            vm.returnedAssigned = vm.teacherService.assigned;
            var assignedMap = {};
            var studentMap = {};

            for (var i = 0; i < vm.returnedAssigned.length; i++) {
                var moduleId = vm.returnedAssigned[i].mod_id;
                var title = vm.returnedAssigned[i].title;
                var studentId = vm.returnedAssigned[i].stud_id;
                var final = vm.returnedAssigned[i].final_grade;
                var response = vm.returnedAssigned[i].response;

                var assignedObj = assignedMap[moduleId];
                var studObj = studentMap[final];
                
                if (assignedObj == null) {
                    var newMod = new ModTitleId (moduleId, title);                    
                    assignedMap[moduleId] = moduleId;
                    vm.modules.push(newMod);
                    if (studObj == null) {
                        var newStud = new StudentGrade (studentId, final, response);
                        studentMap[final] = newStud;
                        newMod.studGrades.push(newStud);
                    } ;  
                } else {
                    if (studObj == null) {
                        var newStud = new StudentGrade (studentId, final, response);
                        studentMap[final] = newStud;
                        newMod.studGrades.push(newStud);
                    };
                };
            };
            console.log('modules and grades after selecting class with', vm.modules);
        });
    }
    //connect to service to make http call to get students by class
    vm.getStudents = function (classId) {
        console.log('in get students with class ID', classId);
        TeacherService.getStudents(classId).then( function () {
            vm.students = vm.teacherService.students;
            console.log('students array after GET', vm.students);            
        })
    };

    vm.deleteStudent = TeacherService.deleteStudent;

    console.log("vm.student", vm.student);
});
