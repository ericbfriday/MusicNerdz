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

    // Creates brand new, non-existing school
    vm.addSchool = AdminUserService.addSchool;

    // creates brand new, non-existing teacher from name and e-mail
    vm.addTeacher = AdminUserService.addTeacher;

    // fetches shools to populate drop down menu
    vm.getSchools = AdminUserService.getSchools;

  });