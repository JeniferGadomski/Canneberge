/**
 * Created by bhacaz on 24/01/17.
 */
angular.module('app')
    .controller('mapController', function ($scope, $rootScope, $compile, $location, apiService) {

        $scope.rasterId = $location.search().rasterId;
        console.log($scope.rasterId);
        $scope.overlay = {};
        $scope.overlay.showRasters = false;
        $scope.overlay.showRasters = false;
        $scope.showShapefile = true;
        $scope.groundOverlay = null;

        var map = null;

        $scope.currentCoord = {};
        $scope.currentField = {};


        $scope.currentMarkerDescritor = {};
        $scope.currentMarker = {};
        $scope.infowindow = {};

        var customIcon = {
            url: '/images/icon.png'
            // // This marker is 20 pixels wide by 32 pixels high.
            // size: new google.maps.Size(16, 16),
            // // The origin for this image is (0, 0).
            // origin: new google.maps.Point(0, 0),
            // // The anchor for this image is the base of the flagpole at (0, 32).
            // anchor: new google.maps.Point(0, 0)
        };

        var dataMapStyle = {
            fillColor: '#485B6B',
            strokeColor : '#DDED36',
            strokeWeight : 1.5,
            icon : customIcon
        };

        var projection  = '+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs';

        $scope.markerColor = [
            {couleur : "Rouge", code : "#fd7567", iconPath : "http://maps.google.com/mapfiles/ms/icons/red-dot.png"},
            {couleur : "Bleu", code : "#6991fd", iconPath : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"},
            {couleur : "Violet", code : "#8e67fd", iconPath : "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"},
            {couleur : "Jaune", code : "#fdf569", iconPath : "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"},
            {couleur : "Vert", code : "#00e64d", iconPath : "http://maps.google.com/mapfiles/ms/icons/green-dot.png"}
        ];


        $scope.sliderRaster = {
            range : {
                min : 0,
                max : 0,
                step : 1
            },
            value : 0,
            next : function () {
                if(this.value < this.range.max) {
                    this.value++;
                    $scope.toggleRasters();
                }
            },
            previous : function () {
                if(this.value > this.range.min) {
                    this.value--;
                    $scope.toggleRasters();
                }
            }
        };

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

        function initRaster() {
            if($scope.rasterId){
                for(var i = 0; i < $scope.ferme.rasters.length; i++){
                    if($scope.ferme.rasters[i]._id === $scope.rasterId){
                        $scope.overlay.showRasters = true;
                        $scope.sliderRaster.value = i;
                        $scope.toggleRasters();
                        return;
                    }
                }
            }
        }

        var initialize = function (event) {

            console.log('intiMap');
            setCenterCoordinate();
            if(map === null){
                map = init();
            }

            $scope.sliderRaster.range.max = $scope.ferme.rasters.length - 1;
            initRaster();

            map.data.setStyle(dataMapStyle);
            map.data.addGeoJson($scope.ferme.shapefiles[0].geojson);
        };

        $scope.displayShapefileManager = function() {
            map.data.forEach(function(feature) {
                map.data.remove(feature);
            });
            map.data.setStyle(dataMapStyle);
            if($scope.showShapefile){
                for (var i = 0; i < $scope.ferme.shapefiles.length; i++) {
                    var shp = $scope.ferme.shapefiles[i];
                    if(shp.show){
                        map.data.addGeoJson(shp.geojson);
                    }
                }
            }

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

        function setCenterCoordinate() {
            if(typeof $scope.ferme.centerCoordinate !== 'undefined' && $scope.ferme.centerCoordinate.lat !== null) return;
            var arrayLng = [];
            var arrayLat = [];

            if($scope.ferme.shapefiles.length > 0){
                var features = $scope.ferme.shapefiles[0].geojson.features;
                for(var i = 0; i < features.length; i++){
                    var coord = features[i].geometry.coordinates[0];
                    for(var j = 0; j < coord.length; j++){
                        arrayLng.push(coord[j][0]);
                        arrayLat.push(coord[j][1])
                    }
                }
            }
            var minLng = Math.min.apply(null, arrayLng);
            var minLat = Math.min.apply(null, arrayLat);
            var maxLng = Math.max.apply(null, arrayLng);
            var maxLat = Math.max.apply(null, arrayLat);

            var center = {
                lat : (maxLat - minLat)/2 + minLat,
                lng : (maxLng - minLng)/2 + minLng
            };
            $scope.ferme.centerCoordinate = center;
            apiService.putFerme($scope.fermeID, {centerCoordinate : center})
                .then(function (response) {
                    console.log(response);
                    $rootScope.$emit('updateWeather');
                });
        }

        var init = function () {
            map = new google.maps.Map(document.getElementById('map'), {
                mapTypeId: 'hybrid',
                center : $scope.ferme.centerCoordinate,
                zoom: 15
            });

            // var bounds = new google.maps.LatLngBounds();
            // map.data.addListener('addfeature', function(e) {
            //     processPoints(e.feature.getGeometry(), bounds.extend, bounds);
            //     map.fitBounds(bounds);
            // });
            // console.log(map.data);

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


        $scope.toggleShapefile = function () {
            // console.log($scope.showShapefile);
            $scope.showShapefile = !$scope.showShapefile;
            if($scope.showShapefile){
                // map.data.addGeoJson($scope.ferme.geojson);
                // map.data.setStyle({
                //     fillColor: '#485B6B',
                //     strokeColor : '#DDED36',
                //     strokeWeight : 1.5,
                //     icon : customIcon
                // });
                $scope.displayShapefileManager();
            }
            else{
                map.data.forEach(function(feature) {
                    map.data.remove(feature);
                });
            }

        };

        $scope.toggleRasters = function () {
            console.log($scope.overlay.showRasters);
            $scope.showRasters = $scope.overlay.showRasters;
            // $scope.overlay.showRasters = !$scope.overlay.showRasters;

            var indexRaster = $scope.sliderRaster.value;
            if($scope.groundOverlay !== null) $scope.groundOverlay.setMap(null);
            if($scope.overlay.showRasters){
                var imageBounds = $scope.ferme.rasters[indexRaster].bounds;
                $scope.groundOverlay = new google.maps.GroundOverlay(
                    apiService.getRasterImageUrl($scope.ferme.rasters[indexRaster].path.png),
                    imageBounds);
                $scope.groundOverlay.setMap(map);
            }
        };

        $scope.valueBand = function (rasterband) {
            if(!rasterband) return {};
            var halfMean = rasterband.mean / 2;
            return {
                max: rasterband.max,
                min : rasterband.min,
                mean : rasterband.mean,
                maxMean: rasterband.max - halfMean,
                minMean : rasterband.min + halfMean
            };
        }





    });
