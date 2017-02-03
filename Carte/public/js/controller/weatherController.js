/**
 * Created by bhacaz on 26/01/17.
 */


angular.module('app')
    .controller('weatherController', function ($scope, apiService) {

        lng= $scope.ferme.centerCoordinate.lng;
        lat= $scope.ferme.centerCoordinate.lat;

        $scope.weather = {};


        var weather = apiService.getWeather(lat, lng);
        weather.forecast.then(
        function (res) {
            $scope.weather.forecast = res.data.forecast;
            console.log(res);
        });

        weather.conditions.then(
        function (res) {
            $scope.weather.current_observation = res.data.current_observation;
            console.log(res);
        });

        $scope.weather.getIcon = function(iconName){
            return 'images/weather-icon/' + iconName + '.png';
        };

        $scope.weather.getBigIcon = function(iconName){
            return 'images/weather-icon/big/' + iconName + '.png';
        };

        $scope.open = function() {
            $scope.showModal = true;
        };

        $scope.cancel = function() {
            $scope.showModal = false;
        };

        // $scope.showModal = true;


    });