/**
 * Created by bhacaz on 23/01/17.
 */
angular.module('apiServiceModule', [])
    .factory('apiService', function($http) {

        var cannerberApi = {};
        var url = 'http://api.canneberge.io/api/';
        cannerberApi.headers = {headers : {'x-access-token' : ''}};

        cannerberApi.getFerme = function (fermeID) {
            return  $http.get(url + 'fermes/' + fermeID, cannerberApi.headers);
        };

        cannerberApi.putFerme = function (fermeID, fermeData) {
            return $http.put(url + 'fermes/' + fermeID, fermeData, cannerberApi.headers)
        };
        
        cannerberApi.getWeahter = function (fermeID) {
            return $http.get(url + 'weather?fermeId=' + fermeID, cannerberApi.headers);
        };

        return cannerberApi;

    });