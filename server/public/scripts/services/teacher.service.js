myApp.service('TeacherService', function ($http) {
    var vm = this;

    var userObject = {};
    
    vm.addClass = function (classInfo) {
        console.log('ViewController -- addClass -- sending to server...', classInfo);
        return $http
            .post('/class/addClass', classInfo)
            .then(function (response) {
            console.log('back from addClass post response:', response);
            });
    }

    vm.getClasses = function (teacherId) {
        console.log('teacher service get classes:', teacherId);
        return $http.get('/teacher/classes/' + teacherId).then(function(res) {
            console.log('response from get classes', res);
            vm.classes = res.data;
        });
    };

    vm.getStudents = function (classId) {
        console.log('teacher service get students:', classId);
        return $http.get('/teacher/students/' + classId).then(function(res) {
            console.log('response from get students', res);
            vm.students = res.data;
        });
    }
});