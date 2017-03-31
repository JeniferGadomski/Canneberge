/**
 * Created by bhacaz on 26/01/17.
 */


angular.module('app')
    .controller('weatherController', function ($scope) {

        $scope.open = function() {
            $scope.showModal = true;
        };

        $scope.cancel = function() {
            $scope.showModal = false;
        };

    });