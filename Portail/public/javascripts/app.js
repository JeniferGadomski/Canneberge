/**
 * Created by bhacaz on 27/02/17.
 */
var app = angular
    .module('app', [
        'apiServiceModule'
    ])
    .config(function($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });