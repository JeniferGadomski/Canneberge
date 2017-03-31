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
        .when('/', {
            templateUrl : '../views/login.html',
            controller : 'mainController'
        })
        .when('/redirecitons', {
            templateUrl : '../views/redirections.html',
            controller : 'mainController'
        })
        .when('/retrieve', {
            templateUrl : '../views/retrieve.html',
            controller : 'mainController'
        })
        .when('/register', {
            templateUrl : '../views/register.html',
            controller : 'registerController'
        })
        .when('/logout', {
            templateUrl : '../views/login.html',
            controller : 'mainController'
        })
});