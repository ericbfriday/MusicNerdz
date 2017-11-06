var myApp = angular.module('myApp', ['ngRoute', 'ngMaterial', 'ngSanitize', 'ngMessages', 'angAccordion', 'jkAngularCarousel']);

/// Routes ///
myApp.config(function($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'LoginController as lc'
    })
    .when('/quizCreation', {
      templateUrl: '/views/templates/quizQuestionCreation.html',
      controller: 'QuizCreation as qc'
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      resolve: {
        getuser : function(UserService){
          return UserService.getuser();
        }
      }
    })
    .when('/viewclass', {
      templateUrl: '/views/templates/viewclass.html',
      controller: 'ViewController as vc',
      
    })
    .otherwise({
      redirectTo: 'user'
    });
});

