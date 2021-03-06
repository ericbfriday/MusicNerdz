"use strict";
const myApp = angular.module('myApp', [
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
      controller: 'AdminViewController as avc',
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
          return StudentService.getMod($route.current.params.id);
        },
        getClasses: function ($route, TeacherService) {
          return TeacherService.getClasses($route.current.params.id);
        },
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/student/grades', {
      templateUrl: '/views/templates/studentGrade.html',
      controller: 'StudentGradeController as sgc',
      resolve: {
        getuser: function (UserService) {
          return UserService.getuser();
        }
      }
    })
    .when('/info', {
      templateUrl: '/views/templates/info.html',
      controller: 'InfoController',
      // resolve: {   getuser : function(UserService){     return
      // UserService.getuser();   } }
    })
    .when('/teacher/gradingform/module/:module/student/:student', {
      templateUrl: '/views/templates/teacherGrading.html',
      controller: 'TeachergradeController as tgc',
      resolve: {
        getgradeform: function ($route, UserService) {
          return UserService.getgradeform($route.current.params.module, $route.current.params.student);
        },
        getteacher: function (UserService, TeacherService) {
          return UserService.getteacher();
        },
        getid: function (UserService) {
          return UserService.getid();
        }
      }
    })
    .when('/viewclass/:id', {
      templateUrl: '/views/templates/viewclass.html',
      controller: 'ViewController as vc',
      resolve: {
        getteacher: function (UserService, TeacherService) {
          return UserService.getteacher();
        },
        getClasses: function (TeacherService, $route) {
          return TeacherService.getClasses($route.current.params.id);
        },
        getid: function (UserService) {
          return UserService.getid();
        }
      }
    })
    .when('/teacher/grading/:id', {
      templateUrl: '/views/templates/gradebook.html',
      controller: 'ViewController as vc',
      resolve: {
        // getid: function (UserService) {
        //   return UserService.getid();
        // },
        getteacher: function (UserService) {
          return UserService.getteacher();
        },
        getClasses: function (TeacherService, $route) {
          return TeacherService.getClasses($route.current.params.id);
        },

      }
    })
    .otherwise({redirectTo: 'user'});
  $mdThemingProvider
    .theme('default')
    .primaryPalette('grey')
    .accentPalette('orange', {'default': '300'});
});
