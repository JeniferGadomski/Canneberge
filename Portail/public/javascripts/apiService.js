/**
 * Created by bhacaz on 27/02/17.
 */
angular.module('apiServiceModule', [])
    .factory('apiService', function($http) {
        var apiService = {};
        var url = 'http://api.canneberge.io/api/';

        apiService.getRedirection = function(apiKey){
            return  $http.get(url + 'users/redirections/' + apiKey);
        };


        return apiService;



    });