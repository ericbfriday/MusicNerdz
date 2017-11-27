myApp
    .controller('ViewController', function ($http, $location, TeacherService, UserService, $mdDialog, $scope, $route) {
        console.log('ViewController created');
        var vm = this;
        vm.teacherService = TeacherService;
        vm.userService = UserService;
        vm.userObject = UserService.userObject;

        console.log('user object from teacher service', vm.userObject);

        //current teacher user for selecting classes and students
        vm.teacher = vm.userObject.user.teachers_id;
        vm.classes = vm.teacherService.classes;
        vm.modules = vm.teacherService.modules;

        function Class(id, title, code) {
            this.id = id;
            this.title = title;
            this.code = code;
            this.students = [];
        }

        function Student(studId, first, last, email) {
            this.studId = studId;
            this.first = first;
            this.last = last;
            this.email = email;
            this.id = studId;
        }

        function StudentGrade(studentId, final, response) {
            this.studId = studentId;
            this.final = final;
            this.response = response;
        }

        function ModTitleId(id, title) {
            this.id = id;
            this.title = title;
            this.studGrades = [];
        }

        //create new class data
        vm.class = {
            id : '',
            title : '',
            code : '',
            teachersId : vm.teacher
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

        $scope.showConfirm = function (ev, classID, student) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog
                .confirm()
                .title('Would you like to delete this student?')
                .textContent('Deletion is permanent.')
                .ariaLabel('Delete Student Confirmation')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog
                .show(confirm)
                .then(function () {
                    $scope.status = 'Deleted!';
                    vm.deleteStudent(classID, student);
                    vm.getClasses(vm.userObject.user.teachers_id);
                    console.log('blah');
                }, function () {
                    $scope.status = 'Canceled';

                });
        };

        $scope.showConfirmClass = function (ev, classID) {
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog
                .confirm()
                .title('Would you like to delete this class?')
                .textContent('Deletion is permanent.')
                .ariaLabel('Delete Class Confirmation')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');

            $mdDialog
                .show(confirm)
                .then(function () {
                    $scope.status = 'Deleted!';
                    vm.deleteClass(classID);
                    $route.reload();
                }, function () {
                    $scope.status = 'Canceled';

                });
        };

        //add class
        vm.addClass = function () {
            console.log('in add class', vm.class);
            TeacherService
                .addClass(vm.class)
                .then(function () {
                    $route.reload();
                    console.log('addClass function after .then');
                });
        };

        vm.relocate = function () {
            $location.path("/teacher/gradingform/module/5/student/46");
        };

        //send student info to server for addition to db
        vm.addStudent = function (classId) {
            console.log('add');
            vm.student.classesId = classId;
            console.log(vm.student.email);
            if (vm.student.email === '' || vm.student.number === '') {
                vm.message = "Please complete all fields!";
            } else {
                console.log('ViewController -- addStudent -- sending to server...', vm.student);
                return $http
                    .post('/student/addStudent', vm.student)
                    .then(function (response) {
                        console.log('LoginController -- registerUser -- success');
                    })
                    .catch(function (response) {
                        console.log('LoginController -- registerUser -- error');
                        vm.message = "Please try again.";
                    });
            }
        };

        //retrieve class list from db by teacher
        vm.getClasses = vm.teacherService.getClasses;

        // call get assigned modules from service vm.getAssigned =
        // vm.teacherService.getAssigned;

        vm.clickAssigned = function (id) {
            vm.modules = [];

            if (!id) {
                console.log('empty');
            } else {
                TeacherService
                .getAssigned(id)
                .then(function (data) {

                    console.log('data', data.data);
                    vm.returnedAssigned = data.data;

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
                            var newMod = new ModTitleId(moduleId, title);
                            assignedMap[moduleId] = moduleId;
                            vm
                                .modules
                                .push(newMod);
                            if (studObj == null) {
                                var newStud = new StudentGrade(studentId, final, response);
                                studentMap[final] = newStud;
                                newMod
                                    .studGrades
                                    .push(newStud);
                            }
                        } else {
                            if (studObj == null) {
                                var newStud = new StudentGrade(studentId, final, response);
                                studentMap[final] = newStud;
                                newMod
                                    .studGrades
                                    .push(newStud);
                            }
                        }
                    }
                });
            }

            console.log('modules info: ', vm.modules);
        };

        vm.clickGetClass = function (id) {
                vm.classes=[];
                console.log('not empty');
                TeacherService
                .getClasses(id)
                .then(function (res) {
                    
                    console.log('response from get classes:', res);
                    vm.returnedClasses = res.data;
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
                            newClass
                                .students
                                .push(newStudent);
                            vm
                                .classes
                                .push(newClass);
                        } else {
                            newClass
                                .students
                                .push(newStudent);
                        }
                    }
                    console.log('class and students after GET', vm.classes);
                });
            

        };

        //connect to service to make http call to get students by class
        vm.getStudents = function (classId) {
            console.log('in get students with class ID', classId);
            TeacherService
                .getStudents(classId)
                .then(function () {
                    vm.students = vm.teacherService.students;
                    console.log('students array after GET', vm.students);
                });
        };

        // vm.deleteStudent = TeacherService.deleteStudent; vm.deleteClass =
        // TeacherService.deleteClass;

        vm.deleteClass = function (classId) {
            console.log('in delete class with classId:', classId);
            TeacherService
                .deleteClass(classId)
                .then(function () {
                    vm.getClasses(vm.teacher);
                    console.log('classes after delete:', vm.classes);
                    $route.reload();
                                });
        }; // end deleteClass

        vm.deleteStudent = function (classId, stud_id) {
            console.log('in delete student with classId & stud_id:', classId, stud_id);
            TeacherService
                .deleteStudent(stud_id)
                .then(function () {
                    vm.students=[];
                    vm.getStudents(classId);
                });
        };

        vm.clickGetClass(vm.userObject.user.teachers_id);

    });