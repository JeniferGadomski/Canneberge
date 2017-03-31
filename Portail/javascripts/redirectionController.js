/**
 * Created by bhacaz on 31/03/17.
 */

angular.module('app')
    .controller('redirectionController', function ($scope, $window, $location, apiService) {
        console.log('redirectionController');
        $scope.redirections = {};
        $scope.user = {};

        $scope.apiKey = {
            value :  localStorage.getItem('apiKey'),
            isUndefined : function () {
                return this.value === null
            }
        };

        apiService.setApiKey($scope.apiKey.value);


        apiService.getRedirection()
            .then(function (res) {
                console.log(res.data);
                $scope.redirections = res.data;
            });

        apiService.getUser($scope.apiKey.value)
            .then(function (res) {
                console.log(res.data);
                $scope.user = res.data.user;
            });

    });