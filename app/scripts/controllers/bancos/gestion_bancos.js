'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:BancosGestionBancosCtrl
 * @description
 * # BancosGestionBancosCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('GestionBancosCtrl', function(coreRequest, $scope, $translate, uiGridConstants) {
    var self = this;
    self.nuevo_banco = {};

    self.gridOptions = {
      paginationPageSizes: [5, 10, 15, 20, 50],
      paginationPageSize: 5,
      enableRowSelection: true,
      enableRowHeaderSelection: false,
      enableFiltering: true,
      enableHorizontalScrollbar: 0,
      enableVerticalScrollbar: 0,
      useExternalPagination: false,
      enableSelectAll: false,
      columnDefs: [{
          field: 'Nit',
          sort: {
            direction: uiGridConstants.DESC,
            priority: 1
          },
          displayName: $translate.instant('NIT'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },
        /*{
          field: 'DenominacionBanco',
          displayName: $translate.instant('DENOMINACION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '20%'
        },*/
        {
          field: 'NombreBanco',
          displayName: $translate.instant('NOMBRE'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '30%'
        },
        {
          field: 'Descripcion',
          displayName: $translate.instant('DESCRIPCION'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '39%'
        },
        /*{
          field: 'CodigoAch',
          displayName: $translate.instant('ACH'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '5%'
        },
        {
          field: 'CodigoSuperintendencia',
          displayName: $translate.instant('CODIGO_SUPER'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          width: '15%'
        },*/
        {
          field: 'EstadoActivo',
          displayName: $translate.instant('ACTIVO'),
          headerCellClass: $scope.highlightFilteredHeader + 'text-center text-info',
          cellTemplate: '<center><input type="checkbox" ng-checked="row.entity.EstadoActivo" disabled></center>',
          width: '8%'
        },
        {
          name: $translate.instant('OPCIONES'),
          enableFiltering: false,
          width: '8%',
          cellTemplate: '<center>' + '<a href="" class="ver" data-toggle="modal" data-target="#modalbanco" ng-click="grid.appScope.id_banco=row.entity.Id">' +
            '<i class="fa fa-eye fa-lg" aria-hidden="true" data-toggle="tooltip" title="{{\'BTN.VER\' | translate }}"></i></a> ' +
            '<a href="" class="editar" ng-click="grid.appScope.gestionBancos.modo_editar(row.entity);grid.appScope.editar=true;" data-toggle="modal" data-target="#modalform">' +
            '<i data-toggle="tooltip" title="{{\'BTN.EDITAR\' | translate }}" class="fa fa-cog fa-lg" aria-hidden="true"></i></a> ' +
            '</center>'
        }
      ]
    };

    //opciones extras para el control del grid
    self.gridOptions.multiSelect = false;
    self.gridOptions.modifierKeysToMultiSelect = false;
    self.gridOptions.enablePaginationControls = true;
    self.gridOptions.onRegisterApi = function(gridApi) {
      self.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope, function() {
        self.cuenta = self.gridApi.selection.getSelectedRows()[0];
      });
    };

    self.cargar_bancos = function() {
      coreRequest.get('banco', $.param({
        limit: -1
      })).then(function(response) {
        self.gridOptions.data = response.data;
      });
    };

    /*self.cargar_sucursales_banco = function(banco) {
      coreRequest.get('sucursal', $.param({
        query: "Banco:" + banco.Id,
        field: "Id,Nombre",
        limit: -1
      })).then(function(response) {
        banco.sucursales = response.data;
      });
    };*/

    self.modo_editar = function(banco) {
      self.nuevo_banco = JSON.parse(JSON.stringify(banco));
    };

    self.agregar_banco = function(form) {
      if ($scope.editar) {
        coreRequest.put('banco', self.nuevo_banco.Id, self.nuevo_banco).then(function(response) {
          swal('', $translate.instant(response.data.Code), response.data.Type);
          self.nuevo_banco = {};
          self.cargar_bancos();
          $("#modalform").modal("hide");
          form.$setPristine();
          form.$setUntouched();
        });
      } else {
        coreRequest.post('banco', self.nuevo_banco).then(function(response) {
          swal('', $translate.instant(response.data.Code), response.data.Type);
          self.nuevo_banco = {};
          self.cargar_bancos();
          $("#modalform").modal("hide");
          form.$setPristine();
          form.$setUntouched();
        });
      }
    };

    $scope.$watch('editar', function() {
      console.log($scope.editar);
      if ($scope.editar === false) {
        self.nuevo_banco = {};
      }
    });

    self.cargar_bancos();




  });
