myApp.service('TeacherService', function ($http, UserService) {
    var vm = this;

    var userObject = {};
    vm.classes = [];

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
        return $http.get('/teacher/assigned/' + classId).then(function(res) {
            console.log('response from get assigned', res);
            vm.assigned = res.data;
        });
    };

    vm.getClasses = function (teacherId) {
        console.log('teacher service get classes:', UserService.userObject);
        // if (teacherId !== UserService.userObject.user.teachers_id){
        //     $location.path('/viewclass/'+UserService.userObject.user.teachers_id);
        // }
        return $http.get('/teacher/classes/' + teacherId).then(function (res) {
            console.log('response from get classes:', res);
            vm.classes = res.data;
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
            
        })
    };
});