/**
 * Created by bhacaz on 27/02/17.
 */

angular.module('app')
    .controller('mainController', function ($scope, $window, $location, apiService) {

        $scope.userForm = {};

        $scope.apiKey = {
            value :  localStorage.getItem('apiKey'),
            isUndefined : function () {
                return this.value === null
            }

        };

        apiService.setApiKey($scope.apiKey.value);

        $scope.getViewPath = function (){
            console.log($scope.apiKey.value);
            return $scope.apiKey.isUndefined() ? 'views/login.html' : 'views/redirections.html';
        };

        function getRedirection(){
            apiService.getRedirection($scope.apiKey.value)
                .then(function (res) {
                    console.log(res.data);
                    $scope.redirections = res.data;
                });
        }

        function getUser() {
            apiService.getUser($scope.apiKey.value)
                .then(function (res) {
                    console.log(res.data);
                    $scope.user = res.data.user;
                });
        }



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

        $scope.clickConnexion =function () {
            apiService.authentification($scope.userForm)
                .then(function (res) {
                    if(res.data.success)
                    {
                        localStorage.setItem('apiKey', res.data.apiKey);
                        $scope.apiKey.value = res.data.apiKey;
                        console.log(res.data.apiKey);
                        apiService.setApiKey(res.data.apiKey);
                        getUser();
                        getRedirection();
                    }
                    else{
                        $scope.errorMessage = res.data.message;
                        console.log(res.data.message);
                    }
                }, function (err) {
                    $scope.errorMessage = err.data.message;
                    console.log(err);
                })
        };

        if(!$scope.apiKey.isUndefined()){
            getUser();
            getRedirection();
        }
        
        function handleLogout() {
            if($window.location.pathname.split('/')[1] === 'logout')
            {
                $window.localStorage.clear();
                $window.location.href = '/';
            }
        }
        handleLogout();





    });