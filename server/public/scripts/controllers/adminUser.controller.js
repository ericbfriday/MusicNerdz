myApp.controller('AdminUserController', function(UserService, $http) {
    console.log('AdminUserController created');
    const vm = this;

    vm.schoolList = [];
    vm.schoolName = '';
    vm.schoolObj = {name: ''};
    vm.teacherEmail = '';
    vm.teacherName = '';
    vm.teacherSchool = '';

    // Creates brand new, non-existing school
    vm.addSchool = (name) => {
        vm.schoolObj.name = name;
        console.log('inside addSchool (vm.schoolObj.name)', vm.schoolObj.name);
        $http.post('/teacher/addSchool', vm.schoolObj)
        .then((response)=> {
            console.log('Logging response from addSchool -> ', response);
            vm.getSchools();
        })
        .catch((err)=> {
            console.log('logging error in catch from addSchool -> ', err);
        });
    };

    // creates brand new, non-existing teacher from name and e-mail
    vm.addTeacher = (name, email, schoolID) => {
        console.log('inside addTeacher (name, email, schoolID)', name, email, schoolID);
        vm.teacherObj = {name:name,email:email,schoolID:schoolID};
        console.log('logging teacherObj -> ', vm.teacherObj);
        
        $http.post('/teacher/addTeacher', vm.teacherObj)
        .then((response)=>{console.log('Logging response from addTeacher -> ', response);
        })
        .catch((err)=>{console.log('Logging error in addTeacher catch -> ', err);
        });
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