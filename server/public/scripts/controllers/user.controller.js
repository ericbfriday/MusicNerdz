myApp
  .controller('UserController', function (UserService, $scope) {
    console.log('UserController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

    vm.arrayData = [
      {
        src: 'http://s0.limitedrun.com/images/1248348/daisy-4fa4818edd221.jpg'
      }, {
        src: 'http://s0.limitedrun.com/images/1248348/daisy-4fa4818edd221.jpg'
      }, {
        src: 'http://s0.limitedrun.com/images/1248348/daisy-4fa4818edd221.jpg'
      }, {
        src: 'http://s0.limitedrun.com/images/1248348/daisy-4fa4818edd221.jpg'
      }
    ];
  });
