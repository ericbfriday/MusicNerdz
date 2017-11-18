'use strict';
myApp.service('TeacherService', function ($http, UserService) {
    var vm = this;


    // let userObject = {};
    vm.classes = [];
    vm.modules = [];

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

    vm.addClass = function (classInfo) {
        console.log('ViewController -- addClass -- sending to server...', classInfo);
        return $http
            .post('/class/addClass', classInfo)
            .then(function (response) {
                console.log('back from addClass post response:', response);
            });
    };

    vm.getAssigned = function (classId) {
        vm.modules = [];
        console.log('teacher service get assigned:', classId);
        return $http.get('/teacher/assigned/' + classId).then(function(res) {
            console.log('response from get assigned', res);

            vm.returnedAssigned = res.data;
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
                    vm.modules.push(newMod);
                    if (studObj == null) {
                        var newStud = new StudentGrade(studentId, final, response);
                        studentMap[final] = newStud;
                        newMod.studGrades.push(newStud);
                    } 
                } else {
                    if (studObj == null) {
                        var newStud = new StudentGrade(studentId, final, response);
                        studentMap[final] = newStud;
                        newMod.studGrades.push(newStud);
                    }
                }
            }
        });
    };

    vm.getClasses = function (teacherId) {
        vm.classes = [];
        console.log('teacher service get classes:', teacherId);
        return $http.get('/teacher/classes/' + teacherId).then(function (res) {
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
                    newClass.students.push(newStudent);
                    vm.classes.push(newClass);
                } else {
                    newClass.students.push(newStudent);
                };
            };
            console.log('class and students after GET', vm.classes);
        });
    };

    vm.getStudents = function (classId) {
        console.log('teacher service get students:', classId);
        return $http.get('/teacher/students/' + classId).then(function (res) {
            console.log('response from get students', res);
            vm.students = res.data;
        });
    };

    vm.deleteStudent = function (student) {
        console.log('teacher service delete student:', student);
        return $http.delete('/teacher/deleteStudent/' + student).then(function (res) {
            console.log('response from delete student:', res);
            vm.student = res.data;
            
        });
    };

    vm.deleteClass = function (classId) {
        console.log('teacher.service delete class:', classId);
        return $http.delete('/teacher/deleteClass/' + classId).then(function (res) {
            console.log('response from delete class:', res);
            vm.classes = res.data;
            
        }); //end $http.delete
    }; //end deleteClass

    vm.getStdRsps = function () {
        vm.stdRsps = [{one:'one',}, {two:2}];
        console.log('stdRsps:', vm.stdRsps);
    }; //end getStdRsps
    vm.getStdRsps();

    vm.updateAssigned = function (updateModArr, modId) {
        console.log('classes to update in teacherService', updateModArr, modId);
        let assignObj = {
            classArr: updateModArr,
            moduleId: modId
        };

        return $http.post('/teacher/assign', assignObj)
        .then((res) => {
            console.log('post response ', res);
        });
    };
});