myApp
  .controller('LoginController', function ($http, $location, UserService) {
    console.log('LoginController created');
    var vm = this;
    vm.user = {
      username: '',
      password: ''
    };

    vm.message = '';
    vm.userService = UserService;
    vm.userObject = UserService.userObject;
    vm.path = $location.path();

    vm.login = function () {
      console.log('LoginController -- login');
      if (vm.user.username === '' || vm.user.password === '') {
        vm.message = "Enter your username and password!";
      } else {
        $http
          .post('/', vm.user)
          .then(function (response) {
            if (response.data.username) {
              if (response.data.students_id===null && response.data.teachers_id===null) {
                $location.path('/admin/home');
                console.log('admin! moving along');
                return;
              }
              console.log('LoginController -- login -- success: ', response.data);
              // location works with SPA (ng-route)
              $location.path('/user'); // http://localhost:5000/#/user
            } else {
              console.log('LoginController -- login -- failure: ', response);
              vm.message = "Wrong!!";
            }
          })
          .catch(function (response) {
            console.log('LoginController -- registerUser -- failure: ', response);
            vm.message = "Wrong!!";
          });
      }
    };

    vm.registerUser = function () {
      console.log('LoginController -- registerUser');
      if (vm.user.username === '' || vm.user.password === '') {
        vm.message = "Choose a username and password!";
      } else {
        console.log('LoginController -- registerUser -- sending to server...', vm.user);
        $http
          .post('/register', vm.user)
          .then(function (response) {
            console.log('LoginController -- registerUser -- success');
            $location.path('/home');
          })
          .catch(function (response) {
            console.log('LoginController -- registerUser -- error');
            vm.message = "Please try again.";
          });
      }
    };

    vm.passwordReset = function(email) {
      console.log('Send reset email');
      $http.get('/resetRoute/' + email).then(function(response){
        console.log(response);
      });
      vm.email = '';
      vm.message = 'An email has been sent to ' +  vm.email + ' with instructions on how to reset your password.'
    };
  });