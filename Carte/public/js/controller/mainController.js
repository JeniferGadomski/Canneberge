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


        $scope.toggleFullScreenTable = function () {
            var map = document.getElementById('col-map');
            var table = document.getElementById('col-table');

            map.classList.toggle('col-sm-8');
            if ( map.style.display != 'none' ) {
                map.style.display = 'none';
            }
            else {
                map.style.display = '';
            }

        }




    });