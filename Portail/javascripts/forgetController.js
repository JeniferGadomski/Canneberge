/**
 * Created by bhacaz on 05/04/17.
 */
/**
 * Created by bhacaz on 07/03/17.
 */

angular.module('app')
    .controller('forgetController', function ($scope, $http) {

        $scope.email = null;

        $scope.form = {
            validEmail : function (email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            },
            validPassword : function () {
                return $scope.registerForm.password.length >= 3 && $scope.registerForm.password === $scope.registerForm.passwordConfirm;
            },
            valid : function () {
                return this.validEmail($scope.email);
            }
        };

        $scope.sendMail = function () {
            console.log("False -> Mail send!!!");

            // var formData = {
            //     to: '<' + $scope.email + '>',
            //     subject: 'Hello',
            //     text: 'body text'
            // };
            //
            // $http({
            //     "method": "POST",
            //     data: formData
            // }).then(function(success) {
            //     console.log("SUCCESS " + JSON.stringify(success));
            // }, function(error) {
            //     console.log("ERROR " + JSON.stringify(error));
            // });
        }

    });