/**
 * Created by bhacaz on 24/01/17.
 */

angular.module('app')
    .controller('mainController', function ($scope, $rootScope, $window, apiService) {
        $scope.title = 'Carte';
        $scope.fermeID = $window.location.pathname.split('/')[1];
        $scope.weather = {};




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