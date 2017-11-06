myApp.controller('ViewController', function (UserService) {
    console.log('ViewController created');
    var vm = this;
    vm.userService = UserService;
    vm.class1 = {
        name: 'firstHour'
    };

    vm.class2 = {
        name: 'secondHour'
    };

    vm.classes = [vm.class1, vm.class2]
    vm.addStudent = function () {

    };
    console.log("vm.classes", vm.classes);
});
