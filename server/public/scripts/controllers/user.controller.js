myApp
  .controller('UserController', function (UserService, StudentService) {
    console.log('UserController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

  });