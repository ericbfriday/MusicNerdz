"use strict";

myApp.controller("AdminViewController", function ($http) {
    const vm = this;

    vm.modList = {
        data: []
    };

    vm.feedback = [];

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

    vm.getFeedback = function (id) {
        $http.get('/student/getFeedback/' + id)
        .then( function (res) {
            console.log('getFeeedback response -> ', res);
            vm.feedback = res.data.rows;
            console.log('logging vm.feedback -> ', vm.feedback);
        })
        .catch( (err) => {
            console.log('Logging err in getFeedback catch -> ', err);
        });
    };
});