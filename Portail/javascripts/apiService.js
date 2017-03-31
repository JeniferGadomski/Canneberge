/**
 * Created by bhacaz on 27/02/17.
 */
angular.module('apiServiceModule', [])
    .factory('apiService', function($http) {
        var apiService = {};
        var url = 'http://api.canneberge.io/api/';
        var headers = {headers : {'x-access-token' : ''}};
        var serviceApiKey;

        apiService.getRedirection = function(){
            return  $http.get(url + 'users/' + serviceApiKey + '/redirections', headers);
        };

        apiService.getUser = function(){
            return  $http.get(url + 'users/' + serviceApiKey, headers);
        };

        apiService.authentification = function(userForm){
            return $http.post(url + 'authentification/', userForm);
        };

        apiService.setApiKey = function (newApiKey) {
            console.log(newApiKey);
            serviceApiKey = newApiKey;
            headers = {headers : {'x-access-token' : newApiKey}};
        };

        apiService.postUser = function (form) {
            return $http.post(url + 'users/', form);
        };

        return apiService;
    });