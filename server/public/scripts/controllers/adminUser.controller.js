myApp.controller('AdminUserController', function(UserService, $http) {
    console.log('AdminUserController created');
    const vm = this;

    vm.schoolList = [];
    vm.schoolName = '';
    vm.teacherEmail = '';
    vm.teacherName = '';

    // Creates brand new, non-existing school
    vm.addSchool = (name) => {
        console.log('inside addSchool (name)', name);
        // need to call list of schools to update the view for adding teacher. Need to re-run school GET function.
        vm.getSchools();
    };

    // creates brand new, non-existing teacher from name and e-mail
    vm.addTeacher = (name, email, school) => {
        console.log('inside addTeacher (name, email)', name, email, school);
    };

    vm.getSchools = () => {
        return $http.get('/teacher/schools')
        .then((res) => {
            vm.schoolList = res.data.rows;
            console.log('logging vm.schoolList -> ', vm.schoolList);
        }, (err) => {
            console.log('logging err in getSchools -> ', err);
        })
        .catch((reason => {
            console.log('error reason in getSchools -> ', reason);
        }));
    };



  });