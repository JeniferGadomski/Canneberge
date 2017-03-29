/**
 * Created by bhacaz on 24/01/17.
 */
angular.module('app')
    .controller('mapController', function ($scope, $rootScope, $compile, apiService) {


        var map = null;
        $scope.currentCoord = {};
        $scope.currentField = {};


        $scope.currentMarkerDescritor = {};
        $scope.currentMarker = {};
        $scope.infowindow = {};

        var projection  = '+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

        $scope.markerColor = [
            {couleur : "Rouge", code : "#fd7567", iconPath : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"},
            {couleur : "Bleu", code : "#6991fd", iconPath : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
            {couleur : "Violet", code : "#8e67fd", iconPath : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"},
            {couleur : "Jaune", code : "#fdf569", iconPath : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"},
            {couleur : "Vert", code : "#00e64d", iconPath : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        ];



        $scope.markerFunction = {
            getMarkerFromMarkerDescriptor : function (markerDescriptor, map) {
                return new google.maps.Marker({
                    position: markerDescriptor.latLng,
                    map: map,
                    icon : markerDescriptor.color.iconPath,
                    title : markerDescriptor.title,
                    id : markerDescriptor.id
                });
            },
            getLatLngString : function (des) {
                return des.latLng.lat.toFixed(6) + ", " + des.latLng.lng.toFixed(6);
            },
            getUtmString : function (des) {
                var utm = getUtmFromLatLng(des.latLng.lat, des.latLng.lng);
                return utm[0].toFixed(2) + ', ' + utm[1].toFixed(2);
            }
        };




        var initialize = function (event) {
            console.log('intiMap');
            if(map == null){
                map = init();
            }

            // map.data.addGeoJson($scope.ferme.geojson);
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
            });

            google.maps.event.addListener(drawingManager, 'markercomplete', function(marker) {
                var id = Math.floor(Date.now() + Math.random());
                $scope.currentMarkerDescritor = {
                    latLng : {lat : marker.getPosition().lat(), lng : marker.getPosition().lng()},
                    color : $scope.markerColor[0],
                    id : id
                };
                $scope.ferme.markers.push($scope.currentMarkerDescritor);
                marker.setIcon($scope.markerColor[0].iconPath);
                marker['id'] = id;
                $scope.currentMarker = marker;
                initMarker(true);
            });

            google.maps.event.addListener(drawingManager, 'mousemove', function (event) {
                updateLatLng(event);
            });

            if(typeof $scope.ferme.centerCoordinate === 'undefined'){
                apiService.putFerme($scope.fermeID, {centerCoordinate : map.getCenter()})
                    .then(function (response) {
                        console.log(response);
                        $rootScope.$emit('updateWeather');
                    });
            }

            map.data.addListener('click', function(event) {
                var rowId = event.feature.getProperty('id');
                colorizeField(rowId);
                $rootScope.$emit('polygonSelect', rowId);
                console.log(event.feature);
            });

            $scope.infowindow = new google.maps.InfoWindow();
            $scope.ferme.markers.forEach(function (v) {
                $scope.currentMarkerDescritor = v;
                $scope.currentMarker = $scope.markerFunction.getMarkerFromMarkerDescriptor(v, map);
                initMarker(false);
            });

            /*
            Test show raster on map
             */
            var imageBounds = $scope.ferme.rasters[0].bounds;
            raster1 = new google.maps.GroundOverlay(
                'http://api.canneberge.io' + $scope.ferme.rasters[0].path.png +'?apiKey=5894a2f1df1f28501873a566',
                imageBounds);
            raster1.setMap(map);

            return map;
        };

        function initMarker(openWindow){
            var content = '<div><div id="infowindow_content" ng-include="\'/partiel/infowindow.html\'"></div></div>';
            var compiled = $compile(content)($scope);

            google.maps.event.addListener($scope.currentMarker, 'click', (function(marker, content, scope, markerDescriptor) {
                return function() {
                    scope.currentMarkerDescritor = markerDescriptor;
                    scope.currentMarker = marker;
                    scope.$apply();
                    scope.infowindow.setContent(content);
                    scope.infowindow.open(scope.map, marker);
                };
            })($scope.currentMarker, compiled[0], $scope, $scope.currentMarkerDescritor));

            if(openWindow){
                $scope.$apply();
                $scope.infowindow.setContent(compiled[0]);
                $scope.infowindow.open(map, $scope.currentMarker);
            }
        }

        $scope.changeMarkerIcon = function (color) {
            $scope.currentMarker.setIcon(color.iconPath);
            $scope.ferme.markers.forEach(function (v) {
                if(v.id == $scope.currentMarker.id)
                    v.color = color;
            });
        };

        $scope.deleteMarker = function () {
            $scope.ferme.markers.forEach(function (v, i) {
                if(v.id === $scope.currentMarker.id){
                    $scope.ferme.markers.splice(i, 1);
                }
            });
            $scope.currentMarker.setMap(null);
        };

        $scope.$watch('currentMarkerDescritor.title', function () {
            $scope.currentMarker.setTitle($scope.currentMarkerDescritor.title);
        });

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
                    $scope.currentField['hectare'] = (mSquare / 10000).toFixed(4);
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
            var utm = getUtmFromLatLng(lat, lng);

            utmx = utm[0].toFixed(2);
            utmy = utm[1].toFixed(2);

            $scope.currentCoord['lat'] = lat;
            $scope.currentCoord['lng'] = lng;
            $scope.currentCoord['utmx'] = utmx;
            $scope.currentCoord['utmy'] = utmy;
        };

        function getUtmFromLatLng(lat, lng) {
            return proj4(projection, [lng, lat]);
        }

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
