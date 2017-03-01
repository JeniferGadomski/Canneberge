/**
 * Created by bhacaz on 27/02/17.
 */

angular.module('app')
    .controller('mainController', function ($scope, apiService) {

        $scope.userForm = {};


        $scope.apiKey = {
            value :  localStorage.getItem('apiKey'),
            isUndefined : function () {
                console.log(this.value);
                return typeof this.value === 'undefined'
            }

        };

        apiService.getRedirection($scope.apiKey.value)
            .then(function (res) {
                console.log(res.data);
                $scope.redirections = res.data;
            });
        console.log($scope.redirections);


        $scope.form = {
            validEmail : function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            valid : function () {
                var passwordValid = typeof  $scope.userForm.password !== 'undefined' && $scope.userForm.password !== '';
                return this.validEmail($scope.userForm.email) && passwordValid;
            }
        };





    });