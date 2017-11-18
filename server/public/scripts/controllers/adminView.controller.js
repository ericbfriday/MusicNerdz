"use strict";

myApp.controller("AdminViewController", function ($http, $mdDialog, $scope) {
    const vm = this;

    vm.modList = {
        data: []
    };

    vm.feedback = {
        data: []
    };

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
            vm.feedback.data = res.data.rows;
            console.log('logging vm.feedback -> ', vm.feedback);
        })
        .catch( function (err) {
            console.log('Logging err in getFeedback catch -> ', err);
        });
    };

    $scope.showFeedback = function(ev) {
        console.log('logging showFeedback');
        $mdDialog.show({
            controller: 'AdminViewController as avc',
            templateUrl: '/views/partials/adminFeedback.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function() {
            // $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            // $scope.status = 'You cancelled the dialog.';
        });
    };
});