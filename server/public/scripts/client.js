var myApp = angular.module('myApp', [
  'ngRoute',
  'ngMaterial',
  'ngSanitize',
  'ngMessages',
  'angAccordion',
  'ngYoutubeEmbed',
  'md.data.table',
  'ui.carousel',
  'mdCollectionPagination'
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
      controller: 'ResourcesController as rc',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
    })
    .when('/admin/home', {
      templateUrl: '/views/templates/adminLandingPage.html',
      controller: 'AdminUserController as auc',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
    })
    .when('/admin/songCreation', {
      templateUrl: '/views/templates/moduleSongCreation.html',
      controller: 'SongCreation as sc',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
    })
    .when('/admin/quizCreation', {
      templateUrl: '/views/templates/moduleQuestionCreation.html',
      controller: 'QuizCreation as qc',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
    })
    .when('/admin/eventCreation', {
      templateUrl: '/views/templates/moduleHistoricalEvents.html',
      controller: 'EventCreation as ec',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
    })
    .when('/admin/externalEventCreation', {
      templateUrl: '/views/templates/adminCreateHistoricalEvents.html',
      controller: 'EventCreation as ec',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
    })
    .when('/admin/userMgmt', {
      templateUrl: '/views/templates/adminUserMgmt.html',
      controller: 'AdminUserController as auc',
      resolve: {
        getadmin: function (UserService) {
          return UserService.getadmin();
        }
      }
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
        getuser: function (UserService) {
          return UserService.getuser();
        },
        getfeatured: function (UserService) {
          return UserService.getfeatured();
        },
        // getAllAssigned: function (UserService) {   return
        // UserService.getAllAssigned(); }
      }
    })
    .when('/student/mod/:id', {
      templateUrl: '/views/templates/lesson.html',
      controller: 'StudentModuleController as smc',
      resolve: {
        getmod: function ($route, StudentService) {
          return StudentService.getmod($route.current.params.id);
        }
      }
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
    .when('/teacher/gradingform/', {
      templateUrl: '/views/templates/teacherGrading.html',
      controller: 'TeachergradeController as tgc',
      resolve: {
        getteacher: function (UserService) {
          return UserService.getteacher();
        }
      }
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
    .when('/teacher/grading', {
      templateUrl: '/views/templates/gradebook.html',
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
