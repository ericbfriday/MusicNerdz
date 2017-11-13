myApp.service('AdminUserService', function ($http) {
    var sv = this;

    sv.schoolList = {data: []};
    sv.schoolName = '';
    sv.schoolObj = {name: ''};
    sv.teacherEmail = '';
    sv.teacherFName = '';
    sv.teacherLName = '';
    sv.teacherSchool = '';
    sv.teacherList = {data: []};

    // establishes structure of teacher object to be sent to router.
    class Teacher {
        constructor(fname, lname, email, schoolID, password){
            this.fname = fname;
            this.lname = lname;
            this.email = email;
            this.schoolID = schoolID;
            this.password = password;
        }
    } // end class Teacher

    // Creates brand new, non-existing school
    sv.addSchool = function (name) {
        sv.schoolObj.name = name;
        // console.log('inside addSchool (sv.schoolObj.name)', sv.schoolObj.name);
        return $http.post('/teacher/addSchool', sv.schoolObj)
        .then((response)=> {
            console.log('Logging response from addSchool -> ', response);
            sv.getSchools();
            document.getElementById("addSchoolForm").reset();
        })
        .catch((err)=> {
            console.log('logging error in catch from addSchool -> ', err);
        });
    }; // end addSchool()

    sv.deleteSchool = function (school) {
        console.log('logging school.id to delete -> ', school.id);
        return $http.delete('/teacher/deleteSchool/' + school.id)
        .then((response)=>{
            console.log('logging response in deleteSchool -> ', response);
        
        })
        .catch((err)=> {
            console.log('logging error in catch from deleteSchool -> ', err);
        });
    }

    // creates brand new, non-existing teacher from name and e-mail
    sv.addTeacher = function (fname, lname, email, schoolID) {
        sv.teacherObj = new Teacher(fname, lname, email, schoolID, sv.passwordGenerator());
        return $http.post('/teacher/addTeacher', sv.teacherObj)
        .then((response)=>{
            console.log('Logging response from addTeacher -> ', response);
            document.getElementById("addTeacherForm").reset();
        })
        .catch((err)=>{
            console.log('Logging error in addTeacher catch -> ', err);
        });
    }; // end addTeacher()

    sv.getSchools = function () {
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

    sv.getTeachers = function () {
        return $http.get('/teacher/teachers')
        .then((res) => {
            sv.teacherList.data = res.data.rows;
            console.log('logging sv.teacherList -> ', sv.teacherList);
        }, (err) => {
            console.log('logging err in getTeachers -> ', err);
        })
        .catch((reason => {
            console.log('error reason in getTeachers -> ', reason);
        }));
    }; // end getTeachers()

    sv.passwordGenerator = function () {
        let length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        console.log('retVal => ', retVal);
        
        return retVal;        
    };
});