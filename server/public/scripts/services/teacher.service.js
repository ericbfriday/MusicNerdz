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
        console.log('teacher service get assigned:', classId);
        return $http.get('/teacher/assigned/' + classId);
    };

    vm.getClasses = function (teacherId) {
        vm.classes = [];
        console.log('teacher service get classes:', teacherId);
        return $http.get('/teacher/classes/' + teacherId);
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