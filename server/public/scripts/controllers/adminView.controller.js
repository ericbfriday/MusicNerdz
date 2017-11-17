"use strict";

myApp.controller("AdminViewController", function ($http) {
    const vm = this;

    vm.modList = {data: []};

    vm.getModules = function () {
        $http.get('/student/getAllModules')
            .then(function (res) {
                console.log('Logging response in /getallModules admin route -> ', res);
                vm.modList.data = res.data;
            })
            .catch(function (reason) {
                console.log('Logging catch reason in adminView.controller -> ', reason);
            });
    };
});