/**
 * Created by bhacaz on 27/02/17.
 */
angular.module('apiServiceModule', [])
    .factory('apiService', function($http) {
        var apiService = {};
        var url = 'http://api.canneberge.io/api/';
        var headers = {headers : {'x-access-token' : ''}};


        apiService.getRedirection = function(apiKey){
            return  $http.get(url + 'users/' + apiKey + '/redirections', headers);
        };

        apiService.getUser = function(apiKey){
            return  $http.get(url + 'users/' + apiKey, headers);
        };

        apiService.authentification = function(userForm){
            return $http.post(url + 'authentification/', userForm);
        };

        apiService.setApiKey = function (newApiKey) {
            console.log(newApiKey);
            headers = {headers : {'x-access-token' : newApiKey}};
        };

        return apiService;
    });