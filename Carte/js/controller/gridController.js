/**
 * Created by bhacaz on 25/01/17.
 */

angular.module('app')
    .controller('gridController', function ($scope, $rootScope, $window, apiService, uiGridConstants) {

        // Data for table
        $scope.columns = [];
        $scope.dataTable = [];
        $scope.nbHideColumn = 0;
        $scope.gridOptions = {};
        var currentGeoJson;
        $scope.indexCurrentGeojson = 0;

        function updateGridOptions() {
            $scope.gridOptions.columnDefs = $scope.columns;
            $scope.gridOptions.data = $scope.dataTable;
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
        }

        $scope.gridOptions = {
            columnDefs : $scope.columns,
            data: $scope.dataTable,
            enableHorizontalScrollbar: 2,
            enableGridMenu: true,
            exporterCsvFilename: 'export.csv',
            exporterMenuPdf: false,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            importerDataAddCallback: function ( grid, newObjects ) {
                importCSV(grid, newObjects);
            },
            onRegisterApi: function(gridApi){
                $scope.gridApi = gridApi;
            }
        };


        $scope.gridOptions.multiSelect = false;
        $scope.gridOptions.modifierKeysToMultiSelect = false;
        $scope.gridOptions.enableRowSelection = true;
        $scope.gridOptions.enableRowHeaderSelection = false;


        function updateGeojson(){
            var updatedGeojson = currentGeoJson;
            console.log(updatedGeojson);
            console.log($scope.dataTable);
            for(var fieldIndex in currentGeoJson.features)
                updatedGeojson.features[fieldIndex].properties = $scope.dataTable[fieldIndex];
        }

        function importCSV(grid, newObjects) {
            for(index in $scope.dataTable){
                for (var attrname in newObjects[index]) {
                    console.log($scope.dataTable[index]);
                    $scope.dataTable[index][attrname] = newObjects[index][attrname];
                }
            }
            colNames = [];
            for (var i = 0; i < $scope.columns.length; i++) {
                var obj = $scope.columns[i];
                colNames.push(obj.field);
            }
            for(var attrname in newObjects[0]){
                if(colNames.indexOf(attrname) === -1){
                    $scope.columns.push({
                        field : attrname,
                        menuItems : getMenuItemsColumns(attrname),
                        visible : true,
                        minWidth: 75
                    });
                }
            }
            updateGeojson();
            updateGridOptions();
        }


        $scope.saveGeojson = function () {
            // var updatedGeojson = currentGeoJson;
            // console.log(updatedGeojson);
            // for(var fieldIndex in currentGeoJson.features)
            //     updatedGeojson.features[fieldIndex].properties = $scope.dataTable[fieldIndex];
            apiService.putFerme($scope.fermeID, {markers : $scope.ferme.markers})
                .then(
                    function (response) {
                        console.log(response);
                    }
                );
            apiService.putShapefileData($scope.fermeID, $scope.ferme.shapefiles[$scope.indexCurrentGeojson]._id, angular.copy($scope.dataTable))
                .then(
                    function (rep) {
                        console.log(rep);
                    }
                );

            updateGeojson();
        };

        function findIndiceColumnByName(name) {
            for(var index in $scope.columns){
                if($scope.columns[index].name.toLowerCase() === name.toLowerCase())
                    return index;
            }
            return -1;
        }

        function findRowById(id) {
            for(var index in $scope.dataTable){
                if($scope.dataTable[index].id === id)
                    return index;
            }
            return -1;
        }

        var getMenuItemsColumns = function (colName) {
            return [{
                title : 'Supprimer',
                icon : 'ui-grid-icon-cancel',
                action : function ($event) {
                    var colName = this.context.col.name;

                    swal({
                            title: "Supprimer un attribut!",
                            text: "Voulez-vous vraiment supprimer l'attribut : " + colName,
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Supprimer"
                        },
                        function(){
                            $scope.columns.splice(findIndiceColumnByName(colName), 1);
                            console.log(colName);
                            $scope.dataTable.forEach(function (v) {delete v[colName];});
                            updateGridOptions();
                            updateGeojson(false);
                        });
                },
                shown: function () {
                    return this.context.col.name === colName;
                }
            }];
        };



        // .shapefiles[1].geojson.features["0"].geometry.type
        // .shapefiles[1].geojson.features["0"].geometry.coordinates["0"]
        $scope.updateGeojsonToDisplay = function (index) {
            $scope.indexCurrentGeojson = index;
            currentGeoJson = $scope.ferme.shapefiles[$scope.indexCurrentGeojson].geojson;
            $scope.dataTable = [];

            var features = angular.copy(currentGeoJson.features);
            for(var field in features){
                var f = features[field];
                if(f.geometry.type === 'Point'){
                    var utm = apiService.getUtmFromLatLng(f.geometry.coordinates[1], f.geometry.coordinates[0]);
                    f.properties.x = utm.x;
                    f.properties.y = utm.y;
                }
            }

            var colName = [];
            for(var header in features[0].properties)
                colName.push(header);
            colName.splice(colName.indexOf('id'), 1);
            colName.unshift('id');

            for(var field in features){
                var f = features[field];
                console.log(f.properties);
                $scope.dataTable.push(f.properties);
            }

            var tmpNewCol = [];
            for(var field in colName){
                var col = {
                    field : colName[field],
                    menuItems : getMenuItemsColumns(colName[field]),
                    visible : true,
                    minWidth: 75
                };
                if(colName[field] === 'id'){
                    col.enableCellEdit = false;
                }
                tmpNewCol.push(col);
            }
            $scope.columns = tmpNewCol;
            updateGridOptions();
        };

        var initGrid = function () {
            $scope.ferme.shapefiles[$scope.indexCurrentGeojson].show = true;
            $scope.updateGeojsonToDisplay($scope.indexCurrentGeojson);
        };


        $rootScope.$on('initGrid', initGrid);

        $scope.addColumn = function () {
            var today = new Date();
            var date = today.getDate() + '/' + (today.getMonth()+1) + '/' + today.getFullYear() + '-' + today.getHours()
                + ':' + today.getMinutes() + ':' + today.getSeconds();

            swal({
                    title: "Nouveau attribut",
                    text: "Nom de l'attribut : ",
                    type: "input",
                    showCancelButton: true,
                    closeOnConfirm: false,
                    inputValue: date
                },
                function(colName){
                    if (colName === false) return false;

                    if (colName === "") {
                        swal.showInputError("L'attribut doit avec un nom.");
                        return false
                    }
                    $scope.columns.push({
                        field : colName,
                        menuItems : getMenuItemsColumns(colName),
                        visible : true,
                        minWidth: 75
                    });
                    $scope.dataTable.forEach(function (v) {
                        v[colName] = null;
                    });
                    updateGridOptions();
                    updateGeojson();
                    swal.close();
                });

        };

        $scope.resetHide = function () {
            $scope.columns.forEach(function (v) {
                v.visible = true;
            });
            $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            updateGridOptions();
        };


        $rootScope.$on('polygonSelect', function (event, rowId) {
            $scope.gridApi.grid.modifyRows($scope.gridOptions.data);
            $scope.gridApi.selection.selectRow($scope.gridOptions.data[findRowById(rowId)]);
        });


        $scope.gridOptions.onRegisterApi = function(gridApi){
            //set gridApi on scope
            $scope.gridApi = gridApi;
            $scope.gridApi.grid.registerDataChangeCallback(function (data) {
                $scope.nbHideColumn = 0;
                $scope.columns.forEach(function (v) {
                    if(v.visible === false)
                        $scope.nbHideColumn++;
                })
            }, [uiGridConstants.dataChange.COLUMN]);

            gridApi.cellNav.on.navigate($scope,function(newRowCol, oldRowCol){
                var oldRowId = -1;
                if(oldRowCol != null)
                    oldRowId = oldRowCol.row.entity.id;
                if (newRowCol.row.entity.id != oldRowId) {
                    $rootScope.$emit('rowSelected', newRowCol.row.entity.id );
                    $scope.gridApi.selection.selectRow(newRowCol.row.entity);
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
                }
            });

            gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                updateGeojson();
            });
        };


        
    });