/**
 * Created by bhacaz on 24/01/17.
 */

angular.module('app')
    .controller('mainController', function ($scope, $rootScope, $window, $location, apiService) {
        $scope.title = 'Carte';
        $scope.fermeID = $location.search().fermeId;
        $scope.ferme = {};
        console.log($scope.fermeID);


        // Getting apiKey from portail.canneberge.io
        var remoteStorage = new CrossDomainStorage("http://portail.canneberge.io", "/retrieve");
        remoteStorage.requestValue("apiKey", function(key, value){
            if(value === null){
                $window.location = 'http://portail.canneberge.io';
            }
            else{
                apiService.headers.headers['x-access-token'] = value;
                initFerme();
            }
        });

        if(typeof $scope.fermeID === 'undefined'){
            $window.location = 'http://portail.canneberge.io';
            return;
        }

        $scope.weather = {};

        function initFerme() {
            apiService.getFerme($scope.fermeID)
                .then(
                    function (res) {
                        console.log(res);
                        $scope.ferme = res.data.ferme;
                        $scope.weather = res.data.weather;
                        console.log($scope.ferme);
                        console.log($scope.weather);
                        $rootScope.$emit('initMap');
                        $rootScope.$emit('initGrid');
                    }
                );

        }


        $scope.pop = function () {
            swal("Oops!", "Something went wrong on the page!", "error");
        };

        $scope.saveFerme = function () {
            apiService.putFerme($scope.fermeID, $scope.ferme)
                .then(
                    function (response) {
                        console.log(response);
                    }
                );
        };
    });