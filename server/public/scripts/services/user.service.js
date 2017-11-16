myApp
  .factory('UserService', function ($http, $location, $mdDialog, $window) {
    console.log('UserService Loaded');

    var userObject = {};

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
              console.log('UserService -- getuser -- User Data: ', userObject.user);

              $http
                .get('/student/modules/' + 7)
                .then(function (res) {
                  console.log(res);
                  userObject.assigned = res.data;
                  console.log('logged in, showing assigned modules: ', userObject.assigned);
                })
                .then(function (res) {
                  $http
                    .get('/student/getAllModules')
                    .then(function (res) {
                      userObject.allMods = res.data;
                      console.log('not logged in, showing all modules: ', userObject.allMods);

                      userObject.new = _(userObject.allMods)
                        .differenceBy(userObject.assigned, 'id')
                        .map(_.partial(_.pick, _, 'id'))
                        .value();

                      console.log('logged in, show diff: ', userObject.new);
                    });
                });
            } else {

              console.log('UserService -- getuser -- failure');
              $http
                .get('/student/getAllModules')
                .then(function (res) {
                  userObject.allMods = res.data;
                  console.log('not logged in, showing all modules: ', userObject.allMods);
                });
              // user has no session, bounce them back to the login page
              // $location.path("/home");
            }
          }, function (response) {
            console.log('UserService -- getuser -- failure: ', response);
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
          }, function (response) {
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
                $location.path("/home");
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

            for (var i = resp.data.length; i > 3; i--) {
              userObject.featured = resp.data;
              userObject
                .featured
                .splice(Math.floor(Math.random() * resp.data.length), 1);
            }
          }); //END $http GET
      },

      loadmodule: function (id, ev) {
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.userName = response.data.username;
              console.log('UserService -- getuser -- User Data: ', userObject.userName, id);
              $location.path("/student/module/");

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
      //    });   } else {   } }
    };
  });
