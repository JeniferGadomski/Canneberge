/**
 * Created by bhacaz on 07/03/17.
 */

angular.module('app')
    .controller('registerController', function ($scope, $window, $location, apiService) {

        console.log('Controller works');
        $scope.registerForm = {password : ''};

        $scope.form = {
            validEmail : function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            validPassword : function () {
                return $scope.registerForm.password.length >= 3 && $scope.registerForm.password === $scope.registerForm.passwordConfirm;
            },
            valid : function () {
                return this.validEmail($scope.registerForm.email) && this.validPassword();
            }
        };

        $scope.saveNewUser = function () {
            var copieForm = JSON.parse(JSON.stringify($scope.registerForm));
            delete copieForm.passwordConfirm;
            apiService.postUser(copieForm)
                .then(function (res) {
                    if(res.data.success){
                        if(!alert("Merci, maintenant contacter le l\'administrater.")) $window.location = '/';
                    }
                }, function (err) {
                    console.log(err);
                    $scope.errorMessage = err.data.message;
                });
        };

    });