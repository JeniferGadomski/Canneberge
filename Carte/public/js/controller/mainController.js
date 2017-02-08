/**
 * Created by bhacaz on 24/01/17.
 */

angular.module('app')
    .controller('mainController', function ($scope, $rootScope, $window, apiService) {
        $scope.title = 'Carte';
        $scope.fermeID = $window.location.pathname.split('/')[1];




        apiService.getFerme($scope.fermeID)
            .then(
                function (res) {

                    $scope.ferme = res.data.ferme;
                    console.log($scope.ferme);
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