
var app = angular
    .module('app', ['ngTouch',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.moveColumns',
        'ui.grid.resizeColumns',
        'ui.grid.cellNav',
        'ui.grid.selection',
        'ui.bootstrap.modal',
        'ui.grid.exporter',
        'ui.grid.importer',
        'ui.toggle',
        'ui.bootstrap-slider',
        'oitozero.ngSweetAlert',
        'apiServiceModule'
    ])
    .config(function($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

