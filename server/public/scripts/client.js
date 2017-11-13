var myApp = angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'ngSanitize',
  'ngMessages',
  'angAccordion',
  'ngYoutubeEmbed',
  'md.data.table',
  'ui.carousel'
]);

/// Routes ///
myApp.config(function ($routeProvider, $locationProvider, $mdThemingProvider) {
  $locationProvider.hashPrefix('');
  console.log('myApp -- config');
  $routeProvider
    .when('/register', {
    templateUrl: '/views/templates/register.html',
    controller: 'LoginController as lc'
    })
    .when('/admin/additionalResources', {
      templateUrl: '/views/templates/moduleAdditionalResources.html',
      controller: 'ResourcesController as rc'
    })
    .when('/admin/home', {
      templateUrl: '/views/templates/adminLandingPage.html',
      controller: 'AdminUserController as auc'
    })
    .when('/admin/songCreation', {
      templateUrl: '/views/templates/moduleSongCreation.html',
      controller: 'SongCreation as sc'
    })
    .when('/admin/quizCreation', {
      templateUrl: '/views/templates/moduleQuestionCreation.html',
      controller: 'QuizCreation as qc'
    })
    .when('/admin/eventCreation', {
      templateUrl: '/views/templates/moduleHistoricalEvents.html',
      controller: 'EventCreation as ec'
    })
    .when('/admin/externalEventCreation', {
      templateUrl: '/views/templates/adminCreateHistoricalEvents.html',
      controller: 'EventCreation as ec'
    })
    .when('/admin/userMgmt', {
      templateUrl: '/views/templates/adminUserMgmt.html',
      controller: 'AdminUserController as auc'
    })
    .when('/home', {
      templateUrl: '/views/templates/home.html',
      controller: 'LoginController as lc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController as uc',
      resolve: {
        getfeatured: function (UserService) {
          console.log('resolve featured modules');
          return UserService.getfeatured();
        },
        getMod: function (StudentService) {
          console.log('resolve all modules');
          return StudentService.getMod();
        },
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/student/module', {
      templateUrl: '/views/templates/lesson.html',
      controller: 'StudentModuleController as smc',
      // resolve: {   getuser: function (UserService) {     return
      // UserService.getuser();   } }
    })
    .when('/student/grades', {
      templateUrl: '/views/templates/studentGrade.html',
      controller: 'StudentGradeController as sgc',
      // resolve: {   getuser: function (UserService) {     return
      // UserService.getuser();   } }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      // resolve: {   getuser : function(UserService){     return
      // UserService.getuser();   } }
    })
    .when('/viewclass', {
      templateUrl: '/views/templates/viewclass.html',
      controller: 'ViewController as vc',
      resolve: {
        getteacher: function (UserService) {
          return UserService.getteacher();
        }
      }
    })
    .otherwise({redirectTo: 'user'});
  $mdThemingProvider
    .theme('default')
    .primaryPalette('grey')
    .accentPalette('orange', {'default': '300'});
});
