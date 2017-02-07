/**
 * Created by bhacaz on 23/01/17.
 */
angular.module('apiServiceModule', [])
    .factory('apiService', function($http) {
   var cannerberApi = {};
    var url = 'http://10.248.140.209:8080/api/';



    cannerberApi.getFerme = function (fermeID) {
        return  $http.get(url + 'fermes/' + fermeID);
    };

    cannerberApi.putFerme = function (fermeID, fermeData) {
        return $http.put(url + 'fermes/' + fermeID, fermeData)
    };

    cannerberApi.getWeather = function (lat, lng) {
        //    <!--  exemple de request  http://api.wunderground.com/api/5eea73b2f937ec5c/forecast/q/37.8,-122.4.json-->
        var weatherRequest = {};
        var weatherJsonUrl = "http://api.wunderground.com/api/5eea73b2f937ec5c/forecast/q/" + lat.toString() + "," + lng.toString() + ".json";
        weatherRequest.forecast = $http.get(weatherJsonUrl);

        weatherJsonUrl = "http://api.wunderground.com/api/5eea73b2f937ec5c/conditions/q/" + lat.toString() + "," + lng.toString() + ".json";
        weatherRequest.conditions = $http.get(weatherJsonUrl);

        return weatherRequest;
    };

    return cannerberApi;


});