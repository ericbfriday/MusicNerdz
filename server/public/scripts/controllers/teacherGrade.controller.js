myApp.controller('TeacherGradeController', function ($http, TeacherService) {
    console.log('TeacherGradeController created');
    var vm = this;
    vm.teacherService = TeacherService;
    vm.userObject = TeacherService.userObject;

    function Class (id, title, code) {
        this.id = id;
        this.title = title;
        this.code = code;
        this.students = [];
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
                    classObj.students.push(newStudent);
                };  
            };
            console.log('class and students after GET', vm.classes);            
        });
    };
});