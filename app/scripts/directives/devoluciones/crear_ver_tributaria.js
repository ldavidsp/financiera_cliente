'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:devoluciones/crearVerTributaria
 * @description
 * # devoluciones/crearVerTributaria
 */
angular.module('financieraClienteApp')
  .directive('devolucionesVerTributaria', function () {
    return {
      restrict: 'E',
      scope:{
          devolucion:'='
        },
      templateUrl: 'views/directives/devoluciones/crear_ver_tributaria.html',
      controller:function($scope,$translate,uiGridConstants,gridApiService){
        var ctrl = this;
        ctrl.gridCuentasAsociadas = {
          enableFiltering: true,
          enableSorting: true,
          enableRowSelection: true,
          paginationPageSizes: [5, 10, 15],
          paginationPageSize: 5,
          useExternalPagination: true,
          enableSelectAll: false,
          selectionRowHeaderWidth: 35,
          enableRowHeaderSelection: false,
          multiSelect:false,
          showColumnFooter: true,
          enableCellEditOnFocus: true,
          columnDefs: [
              {
                  field: 'OrdenPago.Consecutivo',
                  displayName: $translate.instant('ORDEN_DE_PAGO'),
                  headerCellClass:'text-info',
                  enableCellEdit:false,
                  width: '14%'
                },
              {
                  field: 'CuentaContable.Codigo',
                  displayName: $translate.instant('CUENTA_CONTABLE'),
                  headerCellClass:'text-info',
                  enableCellEdit:false,
                  width: '14%'
              },
              {
                  field: 'Credito',
                  displayName: $translate.instant('VALOR'),
                  headerCellClass:'text-info',
                  enableCellEdit:false,
                  cellFilter: "currency",
                  width: '20%',
              },
              {
                  field: 'ValorBase',
                  displayName: $translate.instant('VALOR_BASE'),
                  headerCellClass:'text-info',
                  enableCellEdit:false,
                  cellFilter: "currency",
                  width: '14%'
              },
              {
                  field: 'CuentaContable.Naturaleza',
                  displayName: $translate.instant('NATURALEZA'),
                  headerCellClass:'text-info',
                  enableCellEdit:false,
                  width: '20%',
              },
              {
                  field: 'ValorDevolucion',
                  displayName: $translate.instant('VALOR_DEVOLUCION'),
                  headerCellClass:'text-info',
                  cellTemplate: '<div>{{row.entity.ValorDevolucion | currency:undefined:0}}</div>',
                  width: '17%',
                  enableCellEdit:true,
                  cellFilter: "number",
                  type: 'number',
                  aggregationType: uiGridConstants.aggregationTypes.sum,
                  footerCellTemplate: '<div> Total {{col.getAggregationValue() | currency}}</div>',
                  footerCellClass: 'input_right'
              }
          ],
          onRegisterApi: function(gridApi) {
            ctrl.gridApiCtasAsociadas = gridApi;
            ctrl.gridApiCtasAsociadas = gridApiService.pagination(gridApi,ctrl.consultarCuentasAsociadas,$scope);
          },
        }
      },
      controllerAs:'d_devolucionesVerTributaria'
    };
  });
