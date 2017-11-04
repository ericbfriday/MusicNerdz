myApp.controller('StudentModuleController', function (UserService) {
    console.log('StudentModuleController created');
    var vm = this;
    vm.video1 = 'https://www.youtube.com/watch?v=tvTRZJ-4EyI';
    vm.userService = UserService;
});