"use strict";
myApp.controller('StudentModuleController', function (UserService, StudentService, TeacherService, $location, $scope) {
    console.log('StudentModuleController created');
    //GLOBALS
    const vm = this;
    // user
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    // module
    vm.mods = StudentService.mods;
    vm.saQuestions = StudentService.saQuestions;
    vm.mcQuestions = StudentService.mcQuestions;
    vm.essayQuestions = StudentService.essayQuestions;
    vm.histEvents = StudentService.histEvents;
    vm.tags = StudentService.tags;
    vm.addResources = StudentService.addResources;
    //teacher
    vm.classes = TeacherService.classes;
    vm.selectedClasses = [];
    // vm.getClasses = TeacherService.getClasses;

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

    vm.clickModAssign = function(id) {
        vm.classes=[];
        TeacherService.getClasses(id)
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
                    newClass.students.push(newStudent);
                    vm.classes.push(newClass);
                } else {
                    newClass.students.push(newStudent);
                };
            };
            console.log('class and students after GET', vm.classes);
        });
    };


    vm.updateAssigned = TeacherService.updateAssigned;
    vm.path = $location.path();

    // constructor for quiz responses
    function QuizResps(studId, resp, questId) {
        this.studId = studId;
        this.resp = resp;
        this.questId = questId;
    } //END constructor 

    // function to send responses and ids to questions in module to service
    vm.submitQuiz = function () {
        // var to hold answer objects to send to service
        let answersToSend = [];
        // obj to hold responses info
        let resps = {
            ids: [],
            resps: []
        }; //END resps
        // loop through multiple choice questions
        for (let i = 0; i < vm.mcQuestions.data.length; i++) {
            // push their ids into temp obj
            resps.ids.push(vm.mcQuestions.data[i].id);
        } //END for loop
        // loop through short answer questions 
        for (let i = 0; i < vm.saQuestions.data.length; i++) {
            //push their id as well
            resps.ids.push(vm.saQuestions.data[i].id);
        } //END for loop 
        // loop through essay questions 
        for (let i = 0; i < vm.essayQuestions.data.length; i++) {
            //push their id as well
            resps.ids.push(vm.essayQuestions.data[i].id);
        } //END for loop 
        // convert object of mc responses to an array
        let mcResult = Object.keys(vm.McVal).map(function (key) {
            return vm.McVal[key];
        }); //END mcResults
        // convert object of sa responses to an array
        let saResult = Object.keys(vm.SaVal).map(function (key) {
            return vm.SaVal[key];
        }); //END sa Results
        let essayResult = Object.keys(vm.EssayVal).map(function (key) {
            return vm.EssayVal[key];
        }); //END sa Results
        // set var in temp object to combined sa and mc arrays
        let mcSa = mcResult.concat(saResult);
        resps.resps = mcSa.concat(essayResult);
        // loop through ids
        for (let j = 0; j < resps.ids.length; j++) {
            // make new answer objects with student id
            let answer = new QuizResps(vm.userObject.student[0].id, resps.resps[j], resps.ids[j]);
            // push new objects to array
            answersToSend.push(answer);
        } //END for loop
        console.log(answersToSend);
        // feedback prompt
        vm.feedback = prompt("Tell us what you thought of this quiz.");
        console.log('in feedback controller', vm.feedback);
        // CALL service submit quiz with array to send and feedback
        StudentService.submitFb({ feedback: vm.feedback });
        StudentService.submitQuiz(answersToSend);
        // reset inputs
        vm.McVal = {};
        vm.SaVal = {};
        vm.EssayVal = {}; 
        document.getElementById("quiz").reset();
        // take student home when done with lesson 
        $scope.go = function () {
            $location.path('#/user/');
        };
        $scope.go();
    }; //END submitQuiz
}); //END App Controller
