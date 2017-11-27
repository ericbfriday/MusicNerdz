myApp
  .factory('UserService', function ($http, $location, $mdDialog, $window, $q) {
    console.log('UserService Loaded');

    let userObject = {};
    userObject.new = [];
    userObject.allMods = [];
    userObject.studentinfo = [];
    userObject.moduleinfo=[];
    userObject.teacherResponse = '';

    return {
      userObject: userObject,

      getid: function () {
        $http
          .get('/user')
          .then(function (response) {
            if (response.data.username) {
              // user has a curret session on the server
              userObject = response.data;
            }
          });
      },

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
                if ($location.path('/home')) {
                  $location.path('/user');
                }
                // user is a student
                $http
                  .get('/student/modules/' + response.data.id)
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
                    $http
                      .get('/student/id/' + userObject.user.students_id)
                      .then(function (res) {
                        userObject.student = res.data;
                      });
                  });
              } else if (response.data.teachers_id) {
                // if ($location.path('/home')) {
                //   console.log('redirect Teacher!');
                //   $location.path('/user');
                // }
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
      },
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
      },
      getteacherLesson: function () {
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
      },

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

      },
      getgradeform: function (mod, student) {
        userObject.studentinfo = [];
        console.log('module: ', mod, 'student: ', student);
        $http
          .get('/teacher/getGrades/' + student)
          .then(function (resp) {
            console.log('logging resp in /getGrades -> ', resp.data);
            userObject.studentinfo = resp.data;
            userObject
              .studentinfo
              .splice(userObject.studentinfo.length, -5);
            let q = userObject.studentinfo;
            // counts total number of correct & incorrect mc questions & gives % of them
            // included inside getgradeform function due to issues using 'this.' to call
            // func inside the same factory. Avoids refactoring.
            let gradeGenerator = (q) => {
              let correctCounter = 0;
              let totalCounter = 0;
              // console.log('Generating Grades -> ');
              q.forEach((ele) => {
                if (ele.correct == ele.response && ele.type == 'mc') { //checks if MC question for calculating # correct
                  correctCounter++;
                  totalCounter++;
                } else if (ele.correct != ele.response && ele.type == 'mc') { //checks if MC question for calculating # correct
                  totalCounter++;
                }
              }); // end forEach loop
              userObject.numberCorrect = correctCounter;
              userObject.numberTotal = totalCounter;
              userObject.correctPercet = ((correctCounter / totalCounter) * 100);
            }; // end gradeGenerator();
            gradeGenerator(q);
          }); // end $http.get
        $http
          .get('/teacher/gradeform/' + mod + '/' + student)
          .then(function (res) {
            userObject.moduleinfo = res.data[0];
          });
      }, // end getgradeform();
      getFeedback: function (id) {
        var deferred = $q.defer();
        console.log('getfeedback');

        $http
          .get('/student/getFeedback/' + id)
          .then(function (res) {
            deferred.resolve(res.data.rows);
          })
          .catch(function (err) {
            console.log('Logging err in getFeedback catch -> ', err);
          });
        return deferred.promise;

      },

      logout: function () {
        console.log('UserService -- logout');
        $http
          .get('/user/logout')
          .then(function (response) {
            console.log('UserService -- logout -- logged out');
            $location.path("/#/home");
            $window
              .location
              .reload();
          });
      }
    };
  });
