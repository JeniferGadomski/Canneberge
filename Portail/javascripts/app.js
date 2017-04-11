/**
 * Created by bhacaz on 27/02/17.
 */
var app = angular
    .module('app', [
        'apiServiceModule',
        'ngRoute'
    ]);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/redireciton', {
            templateUrl : '../views/redirection.html',
            controller : 'redirectionController'
        })
        .when('/register', {
            templateUrl : '../views/register.html',
            controller : 'registerController'
        })
        .when('/logout', {
            templateUrl : '../views/login.html',
            controller : 'logoutController'
        })
        .when('/forget', {
            templateUrl : '../views/forget.html',
            controller : 'forgetController'
        })
        .when('/', {
            templateUrl : '../views/login.html',
            controller : 'mainController'
        })
        .otherwise({ redirectTo: '/' })
});

angular.module('app')
    .controller('logoutController', function ($scope, $window, $location, apiService) {
        $window.localStorage.clear();
        $location.path('/');
    });