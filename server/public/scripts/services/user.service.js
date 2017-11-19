'use strict';
myApp
  .factory('UserService', function ($http, $location, $mdDialog, $window) {
    console.log('UserService Loaded');

    let userObject = {};
    userObject.new = [];
    userObject.allMods = [];
    userObject.studentinfo = [];

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

              if ((response.data.teachers_id === null && response.data.students_id === null)) {
                // if the user is logged in, and is admin, their home page is the admin panel
                $location.path("/admin/home");
              } else if (response.data.students_id) {
                // user is a student

                $http.get('/student/modules/' + 7)
                  // hard coded, use 'response.data.students_id'
                  .then(function (res) {
                    userObject.assigned = res.data;
                    // get all songs assigned to students in the class
                  })
                  .then(function (res) {
                    $http
                      .get('/student/getAllModules')
                      .then(function (res) {
                        userObject.allMods = res.data;
                        // get all and split out the assigned modules
                        userObject.new = _(userObject.allMods)
                          .differenceBy(userObject.assigned, 'id')
                          .value();
                      });
                  })
                  .then(function (res) {
                    console.log(userObject.user.students_id);
                    $http
                      .get('/student/id/' + userObject.user.students_id)
                      .then(function (res) {
                        userObject.student = res.data;
                        console.log(userObject.student);
                      });
                  });
                $location.path("/user");
              } else if (response.data.teachers_id) {
                $location.path("/user");
                $http
                  .get('/student/getAllModules')
                  .then(function (res) {
                    userObject.allMods = res.data;
                    // get all and split out the assigned modules
                    userObject.new = _(userObject.allMods)
                      .differenceBy(userObject.assigned, 'id')
                      .value();
                  });
              } else {
                $http
                  .get('/student/getAllModules')
                  .then(function (res) {
                    userObject.allMods = res.data;
                    // get all and split out the assigned modules
                    userObject.new = _(userObject.allMods)
                      .differenceBy(userObject.assigned, 'id')
                      .value();
                  });
              }

              // send students/teachers to /user, who are logged in
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
      }, // end getuser();
      getteacher: function () {
        console.log('UserService -- getteacher');
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.user = response.data;
              if (!response.data.teachers_id) {
                $location.path("/home");
                console.log("logged in as student");
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
      }, // end getteacher();
      getadmin: function () {
        console.log('UserService -- get admin');
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject.user = response.data;
              if (!(response.data.teachers_id === null && response.data.students_id === null)) {
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
      }, // end getadmin();
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
      }, // end getfeatured();
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
              $location.path("/student/mod/" + id);

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
      }, // loadmodule();
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
      }, // end logout
      getgradeform: function (mod, student) {
        console.log('module: ', mod, 'student: ', student);
        // $http.get('/student/modules').then(function (res) {
        //     userObject.moduleinfo = res.data;
        //   })
        //   .then(
        $http.get('/student/getGrades')
          .then(function (resp) {
            userObject.studentinfo = resp.data;
            let q = userObject.studentinfo;
            // counts total number of correct & incorrect mc questions & gives % of them
            // included inside getgradeform function due to issues using 'this.' to call func
            // inside the same factory. Avoids refactoring. 
            let gradeGenerator = (q) => { 
              console.log('inside gradeGenerator -> ');
              console.log('loggin q -> ', q);
              let correctCounter = 0;
              let totalCounter = 0;
              console.log('Generating Grades -> ');
              q.forEach((ele) => {
                if (ele.correct == ele.response && ele.type == 'mc') {
                  correctCounter++;
                  totalCounter++;
                } else if (ele.correct != ele.response && ele.type == 'mc') {
                  totalCounter++;
                }
                console.log('logging correctCounter & totalCounter -> ', correctCounter, totalCounter);
              }); // end forEach loop
              userObject.numberCorrect = correctCounter;
              userObject.numberTotal = totalCounter;
              userObject.correctPercet = ((correctCounter / totalCounter)*100);
            }; // end gradeGenerator();
            gradeGenerator(q);
          }); // end $http.get
      } // end getgradeform();
    }; // end return
  }); // end factory