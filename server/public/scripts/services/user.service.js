myApp
  .factory('UserService', function ($http, $location, $mdDialog, $window) {
    console.log('UserService Loaded');

    var userObject = {};
    userObject.new = [];
    userObject.allMods=[];

    return {
      userObject: userObject,

      getuser: function () {
        console.log('UserService -- getuser');
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.user = response.data;
              $http
                .get('/student/modules/' + 7)
                .then(function (res) {
                  userObject.assigned = res.data;
                  console.log(userObject.assigned);
                  
                })
                .then(function (res) {
                  $http
                    .get('/student/getAllModules')
                    // use Lodash to compare all modules to assigned, and return the difference.
                    .then(function (res) {
                      userObject.allMods = res.data;
                      console.log(userObject.allMods);
                      userObject.new = _(userObject.allMods)
                        .differenceBy(userObject.assigned, 'id')
                        .value();
                        console.log('diff', userObject.new);
                        
                    });
                });
            } else {
              console.log('UserService -- getuser -- failure');
              $http
                .get('/student/getAllModules')
                .then(function (res) {
                  userObject.allMods = res.data;
                  console.log('show all modules');
                });
              // user has no session, bounce them back to the login page
              // $location.path("/home");
            }
          }, function (response) {
            $location.path("/home");
          });
      },
      getteacher: function () {
        console.log('UserService -- getteacher');
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.user = response.data;
              if (!response.data.username.teachers_id) {
                $location.path("/home");
              }
              console.log('UserService -- getuser -- User Data: ', userObject.user);
            } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
            }
          }, 
          function (response) {
            console.log('UserService -- getuser -- failure: ', response);
            $location.path("/home");
          });
      },
      getadmin: function () {
        console.log('UserService -- get admin');
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.user = response.data;
              if (!(response.data.username.teachers_id === null && response.data.username.students_id === null)) {
                // if the user has type student/teacher that is null, they are admin
                $location.path("/admin/home");
              }
              console.log('UserService -- getuser -- User Data: ', userObject.user);
            } else {
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
            }
          }, function (response) {
            console.log('UserService -- getuser -- failure: ', response);
            $location.path("/home");
          });
      },

      getfeatured: function () {
        $http
          .get('/student/getAllModules')
          .then(function (resp) {
            // splice random items out of all modules until 3 remain
            for (var i = resp.data.length; i > 3; i--) {
              userObject.featured = resp.data;
              userObject
                .featured
                .splice(Math.floor(Math.random() * resp.data.length), 1);
            }
          }); //END $http GET
      },

      loadmodule: function (id) {
        // send user to module page from landing page
        console.log("module: ", id);
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              console.log('UserService -- getuser -- User Data: ', userObject.userName, id);
              $location.path("/student/mod/"+id);

            } else {
              // user has no session, bounce them back to the login page
              console.log('UserService -- getuser -- failure');
              // user has no session, bounce them back to the login page
              $location.path("/home");
            }
          }, function (response) {
            console.log('UserService -- getuser -- failure: ', response);
            $location.path("/home");
          });

      },

      logout: function () {
        console.log('UserService -- logout');
        $http
          .get('/user/logout')
          .then(function (response) {
            console.log('UserService -- logout -- logged out');
            $window
              .location
              .reload();
          });
      },

      // getAllAssigned: function () {   console.log('userobject', userObject);   if
      // (userObject.user) {     $http       .get('/student/modules/' + 7)
      // .then(function (res) {         userObject.assigned = res.data;
      // console.log('logged in, showing assigned modules: ', userObject.assigned);
      // });   } else {   } }
    };
  });
