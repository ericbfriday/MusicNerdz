myApp.service('TeacherService', function ($http) {
    var vm = this;

    vm.getStudents = function (classId) {
        console.log('teacher service get students:', classId);
        return $http.get('/teacher/students/' + classId).then(function(res) {
            console.log('response from get students', res);
            vm.students = res.data;
        });
    }
});