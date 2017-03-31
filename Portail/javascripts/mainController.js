/**
 * Created by bhacaz on 27/02/17.
 */

angular.module('app')
    .controller('mainController', function ($scope, $window, $location, apiService) {

        $scope.userForm = {};


        $scope.apiKey = {
            isUndefined : function () {
                return this.value === null
            }
        };

        $scope.apiKey.value = localStorage.getItem('apiKey');

        if(!$scope.apiKey.isUndefined()){
            console.log('setUndefined');
            apiService.setApiKey($scope.apiKey.value);
            $location.path('/redireciton');
        }



        // $scope.getViewPath = function (){
        //     console.log($scope.apiKey.value);
        //     return $scope.apiKey.isUndefined() ? 'views/login.html' : 'views/redirection.html';
        // };

        // function getRedirection(){
        //     $window.location.href= '#/redirections';
        //     // apiService.getRedirection($scope.apiKey.value)
        //     //     .then(function (res) {
        //     //         console.log(res.data);
        //     //         $scope.redirections = res.data;
        //     //     });
        // }

        // function getUser() {
        //     apiService.getUser($scope.apiKey.value)
        //         .then(function (res) {
        //             console.log(res.data);
        //             $scope.user = res.data.user;
        //         });
        // }



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
                        ga('set', 'userId', res.data.apiKey); // Définir l'ID utilisateur à partir du paramètre user_id de l'utilisateur connecté.
                        ga('send', 'pageview');
                        localStorage.setItem('apiKey', res.data.apiKey);
                        $scope.apiKey.value = res.data.apiKey;
                        console.log(res.data.apiKey);
                        apiService.setApiKey(res.data.apiKey);
                        $location.path('/redireciton');
                        // getUser();
                        // getRedirection();
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
    });