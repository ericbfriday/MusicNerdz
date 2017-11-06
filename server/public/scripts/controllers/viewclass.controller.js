myApp.controller('ViewController', function (UserService) {
    console.log('ViewController created');
    var vm = this;
    vm.userService = UserService;
    vm.class1 = {
        name: 'firstHour',
        classId: '1'
    };

    vm.class2 = {
        name: 'secondHour',
        classId: '2'
    };

    vm.student = {
        first: '',
        last: '',
        email: '',
        number: '',
        classId: ''
    }

    vm.classes = [vm.class1, vm.class2]
    vm.addStudent = function (classinfo) {
        vm.student.classId = classinfo;
        console.log("vm.student", vm.student);
        
    };
    console.log("vm.student", vm.student);
});
