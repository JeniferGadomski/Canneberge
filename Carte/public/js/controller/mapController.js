/**
 * Created by bhacaz on 24/01/17.
 */
angular.module('app')
    .controller('mapController', function ($scope, $rootScope, apiService) {
        // var map;
        // map.data.addListener('click', function(event) {
        //     map.data.revertStyle();
        //     resetBackgroundRow();
        //     map.data.overrideStyle(event.feature, {fillColor: 'CornflowerBlue'});
        //     document.getElementById(event.feature.getProperty('id')).style.backgroundColor = "CornflowerBlue";
        //     document.getElementById(event.feature.getProperty('id')).scrollIntoView();
        // });
        $scope.currentCoord = {};
        $scope.currentField = {};

        proj4.defs([
            [
                'EPSG:26918',
                '+proj=utm +zone=18 +ellps=GRS80 +datum=NAD83 +units=m +no_defs '
            ]
        ]);

        var projection  = '+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

        var map = null;


        var initialize = function (event) {
            console.log('intiMap');
            if(map == null){
               map = init();
            }

            map.data.addGeoJson($scope.ferme.geojson);
            map.data.setStyle({
                fillColor: '#485B6B',
                strokeColor : '#DDED36',
                strokeWeight : 1.5
            });
        };

        $rootScope.$on('initMap', initialize);

        function processPoints(geometry, callback, thisArg) {
            if (geometry instanceof google.maps.LatLng) {
                callback.call(thisArg, geometry);
            } else if (geometry instanceof google.maps.Data.Point) {
                callback.call(thisArg, geometry.get());
            } else {
                geometry.getArray().forEach(function(g) {
                    processPoints(g, callback, thisArg);
                });
            }
        }

        var init = function () {
            map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: 'hybrid',
                center: {
                    lat: 46.450515,
                    lng: -72.821154
                },
                zoom: 8
            });

            var bounds = new google.maps.LatLngBounds();
            map.data.addListener('addfeature', function(e) {
                processPoints(e.feature.getGeometry(), bounds.extend, bounds);
                map.fitBounds(bounds);
            });
            console.log(map.data);

            var drawingManager = new google.maps.drawing.DrawingManager({
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON,
                        google.maps.drawing.OverlayType.MARKER
                    ]
                }
            });
            drawingManager.setMap(map);


            google.maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
                console.log(map.data);
                if (event.type == google.maps.drawing.OverlayType.POLYGONE) {
                    var geo = google.maps.geometry.poly.containsLocation(latLng,polygon);
                    console.log(geo);
                }
                if(event.type == google.maps.drawing.OverlayType.MARKER){
                    console.log(event);
                }
            });

            google.maps.event.addListener(drawingManager, 'mousemove', function (event) {
                updateLatLng(event);
            });

            if(typeof $scope.ferme.centerCoordinate === 'undefined'){
                apiService.putFerme($scope.fermeID, {centerCoordinate : map.getCenter()})
                    .then(
                        function (response) {
                            console.log(response);
                        }
                    )
            }

            map.data.addListener('click', function(event) {
                var rowId = event.feature.getProperty('id');
                colorizeField(rowId);
                $rootScope.$emit('polygonSelect', rowId);
                console.log(event.feature);
            });

            return map;
        };

        var selectFiledId;
        var colorizeField = function(rowId) {
            map.data.forEach(function(feature) {
                if(rowId === feature.getProperty('id')){
                    map.data.overrideStyle(feature, {fillColor: '#BC3E3E'});
                    var point = [];
                    feature.getGeometry().forEachLatLng(function (ll) {
                        point.push(ll);
                    });
                    var mSquare = google.maps.geometry.spherical.computeArea(point);
                    $scope.currentField['hectare'] = (mSquare / 10000).toFixed(2);
                    // console.log(google.maps.geometry.spherical.computeArea(point).toFixed(2) + ' m²');
                }
                if(selectFiledId !== rowId){
                    if(selectFiledId === feature.getProperty('id')){
                        map.data.overrideStyle(feature, {fillColor : '#485B6B'});
                    }
                }
            });
            selectFiledId = rowId;
        };

        $rootScope.$on('rowSelected', function (event, data) {
            colorizeField(data);
        });
        

        $scope.updateLatLng =  function (event) {
            var pnt = getLatLngByOffset(map, event.offsetX, event.offsetY);
            var lat = pnt.lat().toFixed(6);
            var lng = pnt.lng().toFixed(6);
            var utm = proj4(projection, [lng, lat]);
            utmx = utm[0].toFixed(2);
            utmy = utm[1].toFixed(2);

            $scope.currentCoord['lat'] = lat;
            $scope.currentCoord['lng'] = lng;
            $scope.currentCoord['utmx'] = utmx;
            $scope.currentCoord['utmy'] = utmy;
        };

        function getLatLngByOffset( map, offsetX, offsetY ){
            var currentBounds = map.getBounds();
            var topLeftLatLng = new google.maps.LatLng( currentBounds.getNorthEast().lat(),
                currentBounds.getSouthWest().lng());
            var point = map.getProjection().fromLatLngToPoint( topLeftLatLng );
            point.x += offsetX / ( 1<<map.getZoom() );
            point.y += offsetY / ( 1<<map.getZoom() );
            return map.getProjection().fromPointToLatLng( point );
        }





    });
