'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:conceptos/detalleConceptoOpPlanta
 * @description
 * # conceptos/detalleConceptoOpPlanta
 */
angular.module('financieraClienteApp')
  .directive('detalleConceptoOpPlanta', function (financieraRequest, $translate) {
    return {
      restrict: 'E',
      scope:{
          inputidordenpago:'=',
          inputpestanaabierta: '=?',
        },

      templateUrl: '/views/directives/conceptos/detalle_concepto_op_planta.html',
      controller:function($scope){
        var self = this;
        self.gridOptions_concepto_orden_pago = {
          enableRowSelection: false,
          enableRowHeaderSelection: false,
          // inicio sub tabla
          expandableRowTemplate: 'expandableRowUpc.html',
          expandableRowHeight: 100,
          onRegisterApi: function (gridApi) {
           gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
             if (row.isExpanded) {
               row.entity.subGridOptions = {
                 columnDefs: [
                   { field: 'Id', visible: false},
                   {
                     field: 'Codigo',
                     displayName: $translate.instant('RUBRO') + ' ' + $translate.instant('CODIGO'),
                     width: '30%',
                     cellClass: 'input_center'
                   },
                   {
                     field: 'Vigencia',
                     displayName:$translate.instant('RUBRO') + ' ' + $translate.instant('VIGENCIA'),
                     width: '15%',
                     cellClass: 'input_center'
                   },
                   {
                     field: 'Descripcion',
                     displayName: $translate.instant('RUBRO') + ' ' + $translate.instant('DESCRIPCION')
                   }
                 ]};
                 financieraRequest.get('rubro',
                 $.param({
                   query: "Id:" + row.entity.Concepto.Rubro.Id,
                 })).then(function(response) {
                     console.log(response.data);
                     row.entity.subGridOptions.data = response.data;
                 });
                 row.entity.subGridOptions.data = row.entity.Concepto.Rubro;
               }
             });
           },
           // fin sub tabla
          columnDefs : [
            {field: 'Concepto.Id',             visible : false},
            {field: 'Concepto.Codigo',         displayName: $translate.instant('CODIGO')},
            {field: 'Concepto.Nombre',         displayName: $translate.instant('NOMBRE')},
            {field: 'Concepto.Descripcion',    displayName: $translate.instant('DESCRIPCION')},
            {field: 'Concepto.TipoConcepto.Nombre',    displayName: $translate.instant('TIPO')}
          ]
        };
        //
        $scope.$watch('inputpestanaabierta', function() {
          if ($scope.inputpestanaabierta){
            $scope.a = true;
          }
        })
        // Data para grid
        $scope.$watch('inputidordenpago', function() {
          //get data
          if($scope.inputidordenpago != undefined){
            financieraRequest.get('concepto_orden_pago',
            $.param({
                query: "OrdenDePago.Id:" + $scope.inputidordenpago,
            })).then(function(response) {
              self.gridOptions_concepto_orden_pago.data = response.data;
            });
          }

        })
        // select registro
        /*
        self.gridOptions_concepto_orden_pago.onRegisterApi = function(gridApi){
            //set gridApi on scope
            self.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope,function(row){
              $scope.unidaejecutora = row.entity
            });
          };
        //
        self.gridOptions_concepto_orden_pago.multiSelect = false;
        */
      // fin
      },
      controllerAs:'d_detalleConceptoOpPlanta'
    };
  });
