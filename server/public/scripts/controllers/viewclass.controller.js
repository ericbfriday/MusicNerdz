myApp.controller('ViewController', function (UserService) {
    console.log('ViewController created');
    var vm = this;
    vm.userService = UserService;
});