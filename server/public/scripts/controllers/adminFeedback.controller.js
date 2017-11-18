"use strict";

myApp.controller("AdminFeedbackController", function ($event, $scope) {
    const vm = this;

    $scope.showFeedback = function (ev) {
        console.log('logging showFeedback');
        $mdDialog.show({
                templateUrl: 'adminFeedback.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
            .then(function () {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    };
});