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
            var updatedGeojson = $scope.ferme.geojson;
            console.log(updatedGeojson);
            console.log($scope.dataTable);
            for(var fieldIndex in $scope.ferme.geojson.features)
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
            var updatedGeojson = $scope.ferme.geojson;
            console.log(updatedGeojson);
            for(var fieldIndex in $scope.ferme.geojson.features)
                updatedGeojson.features[fieldIndex].properties = $scope.dataTable[fieldIndex];
            apiService.putFerme($scope.fermeID, {geojson : updatedGeojson, markers : $scope.ferme.markers})
                .then(
                    function (response) {
                        console.log(response);
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


        var initGrid = function () {
            //Format data for the table
            var colName = [];
            for(var header in $scope.ferme.geojson.features[0].properties)
                colName.push(header);
            colName.splice(colName.indexOf('id'), 1);
            colName.unshift('id');

            for(var field in $scope.ferme.geojson.features)
                $scope.dataTable.push($scope.ferme.geojson.features[field].properties);

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