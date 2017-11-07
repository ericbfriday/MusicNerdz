myApp.service('AdminUserService', function ($http) {
    var sv = this;

    sv.schoolList = {data: []};
    sv.schoolName = '';
    sv.schoolObj = {name: ''};
    sv.teacherEmail = '';
    sv.teacherFName = '';
    sv.teacherLName = '';
    sv.teacherSchool = '';

    // establishes structure of teacher object to be sent to router.
    class Teacher {
        constructor(fname, lname, email, schoolID){
            this.fname = fname;
            this.lname = lname;
            this.email = email;
            this.schoolID = schoolID;
        }
    } // end class Teacher

    // Creates brand new, non-existing school
    sv.addSchool = (name) => {
        sv.schoolObj.name = name;
        // console.log('inside addSchool (sv.schoolObj.name)', sv.schoolObj.name);
        return $http.post('/teacher/addSchool', sv.schoolObj)
        .then((response)=> {
            console.log('Logging response from addSchool -> ', response);
            sv.getSchools();
        })
        .catch((err)=> {
            console.log('logging error in catch from addSchool -> ', err);
        });
    }; // end addSchool()

    // creates brand new, non-existing teacher from name and e-mail
    sv.addTeacher = (fname, lname, email, schoolID) => {
        // console.log('inside addTeacher (name, email, schoolID)', fname, lname, email, schoolID);
        sv.teacherObj = new Teacher(fname, lname, email, schoolID);
        
        return $http.post('/teacher/addTeacher', sv.teacherObj)
        .then((response)=>{
            console.log('Logging response from addTeacher -> ', response);
        })
        .catch((err)=>{
            console.log('Logging error in addTeacher catch -> ', err);
        });
    }; // end addTeacher()

    sv.getSchools = () => {
        return $http.get('/teacher/schools')
        .then((res) => {
            sv.schoolList.data = res.data.rows;
            // console.log('logging sv.schoolList -> ', sv.schoolList);
        }, (err) => {
            console.log('logging err in getSchools -> ', err);
        })
        .catch((reason => {
            console.log('error reason in getSchools -> ', reason);
        }));
    }; // end getSchools()

});