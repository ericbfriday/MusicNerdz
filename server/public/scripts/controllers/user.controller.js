myApp
  .controller('UserController', function (UserService) {
    console.log('UserController created');
    var vm = this;
    vm.userService = UserService;
    vm.userObject = UserService.userObject;

    vm.slides = [
      {
        url: "../../assets/images/kittens.jpeg",
        artist: "Cats",
        album: "Faux Paws"
      }, {
        url: "../../assets/images/nav.jpeg",
        artist: "A Record",
        album: "Record on Fire"
      }
    ];
  });
