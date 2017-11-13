myApp.controller('AdminUserController', function(AdminUserService) {
    // console.log('AdminUserController created');
    const vm = this;

    vm.schoolList = AdminUserService.schoolList;
    vm.schoolName = AdminUserService.schoolName;
    vm.schoolObj = AdminUserService.schoolObj;
    vm.teacherEmail = AdminUserService.teacherEmail;
    vm.teacherFName = AdminUserService.teacherFName;
    vm.teacherLName = AdminUserService.teacherLName;
    vm.teacherSchool = AdminUserService.teacherSchool;

    // Function that creates brand new, non-existing school
    vm.addSchool = AdminUserService.addSchool;

    // Function that creates brand new, non-existing teacher from name and e-mail
    vm.addTeacher = AdminUserService.addTeacher;

    // Function that creates shools to populate drop down menu & table
    vm.getSchools = AdminUserService.getSchools;

        /** School & Teacher Functions Below */
    /** Get Schools & Teachers Functions Below */
    vm.getTeachers = AdminUserService.getTeachers;
    vm.teacherList = AdminUserService.teacherList;
    vm.deleteSchool = AdminUserService.deleteSchool;
    // vm.deleteTeacher = AdminUserService.deleteTeacher;
  });