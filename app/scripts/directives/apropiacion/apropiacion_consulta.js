'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:apropiacion/apropiacionConsulta
 * @description
 * # apropiacion/apropiacionConsulta
 */
angular.module('financieraClienteApp')
  .directive('apropiacionConsulta', function (financieraRequest) {
    return {
      restrict: 'E',
      scope: {
        seleccion: '=?',
        filtro: '=?',
        rubrosel: '=?',
        recargar: '=?',
        rubroid: '=?',
        arbol: '=?',
        noresumen: '@?',
        ramasel: '=?',
        vigencia: '=?',
        botones: '=?',
        botonespadre: '=?',
        datachangeevent : '=?'
      },
      templateUrl: 'views/directives/apropiacion/apropiacion_consulta.html',
      controller:function($scope, $translate){
        var self = this;
        self.UnidadEjecutora = 1;
        $scope.datachangeevent = false;        
        console.log($scope.botonesPadre);
        self.treeOptions = {
          nodeChildren: "Hijos",
          dirSelectable: $scope.ramasel,

          injectClasses: {
            ul: "a1",
            li: "a2",
            liSelected: "a7",
            iExpanded: "a3",
            iCollapsed: "a4",
            iLeaf: "a5",
            label: "a6",
            labelSelected: "a8"
          }
        };

        
        self.cargar_arbol = function() {
          $scope.arbol = [];
          financieraRequest.get("rubro/ArbolRubros/",  $.param({
          UnidadEjecutora: self.UnidadEjecutora
        })).then(function(response) {
            
            if (response.data !== null) {
              $scope.arbol = response.data;

            }
          });

        };

        self.arbol_operacion = function(nodo, operacion){
          self.operacion = operacion;
          
          switch (operacion) {
              case "ver":
                  $("#myModal").modal();
                  self.apropiacionsel = null;
                  self.apropiacionsel = nodo;
                  self.apropiacionsel.Apropiacion = null;
                  if (nodo.Hijos == null){
                    financieraRequest.get("apropiacion", $.param({
                      query: "Rubro.Id:"+nodo.Id + ",Vigencia:"+$scope.vigencia
                    })).then(function(response) {
                      
                      if (response.data !== null) {
                        console.log(response.data);
                        self.apropiacionsel.Apropiacion = response.data[0];
                        financieraRequest.get("apropiacion/SaldoApropiacion/"+self.apropiacionsel.Apropiacion.Id, "").then(function(response) {
                          
                          if (response.data !== null) {
                            self.apropiacionsel.Apropiacion.InfoSaldo = response.data;
                          }
                        });
                      }
                    });
                    
                  }else{
                    financieraRequest.get("apropiacion/SaldoApropiacionPadre/"+self.apropiacionsel.Id, $.param({
                      UnidadEjecutora: self.UnidadEjecutora,
                      Vigencia: $scope.vigencia
                    })).then(function(response) {
                      
                      if (response.data !== null) {
                        console.log(response.data);
                        self.apropiacionsel.Apropiacion={Vigencia: $scope.vigencia};
                        self.apropiacionsel.Apropiacion.InfoSaldo = response.data;
                      }
                    });
                  }
                  
                  
                  break;
              case "add":
                  break;
              case "edit":
                  $("#ModalEdicionApr").modal();
                  self.apropiacionsel = nodo;
                  self.apropiacionsel.Apropiacion = null;
                  self.ValorAsignado = null;
                  if (nodo.Hijos == null){
                    financieraRequest.get("apropiacion", $.param({
                      query: "Rubro.Id:"+nodo.Id + ",Vigencia:"+$scope.vigencia
                    })).then(function(response) {
                      
                      if (response.data !== null) {
                        console.log(response.data);
                        self.apropiacionsel.Apropiacion = response.data[0];
                        financieraRequest.get("apropiacion/SaldoApropiacion/"+self.apropiacionsel.Apropiacion.Id, "").then(function(response) {
                          
                          if (response.data !== null) {
                            self.apropiacionsel.Apropiacion.InfoSaldo = response.data;
                          }
                        });
                      }
                    });
                    
                  }
                  break;
              case "delete":
                  break;
              case "config":
                  break;
              default:
          }
        }

        self.expandedNodes = [];
        
        self.expandAllNodes = function (tree) {
          angular.forEach(tree, function(leaf){
            if (leaf.Hijos) {
              self.expandedNodes.push(leaf);
              self.expandAllNodes(leaf.Hijos);

            }
          });

        };

        self.RegistrarApr = function() {
          $("#ModalEdicionApr").modal('hide');
          var aprAregistrar = {};
          var estadoapr = {};
          var rubroapr = {};
          estadoapr.Id = 1;
          rubroapr.Id = parseInt(self.apropiacionsel.Id);
          rubroapr.Nombre = self.apropiacionsel.Nombre;
          rubroapr.Codigo = self.apropiacionsel.Codigo;
          aprAregistrar.Vigencia = $scope.vigencia;
          aprAregistrar.Estado = estadoapr;
          aprAregistrar.Rubro = rubroapr;
          aprAregistrar.Valor = self.ValorAsignado;
          console.log(aprAregistrar);
          financieraRequest.post('apropiacion', aprAregistrar).then(function(response){
            console.log(response.data);
            if (response.data.Type !== undefined){
              if (response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
              }else{
                swal('',$translate.instant(response.data.Code)+ " : "+$translate.instant('APROPIACION')+" : "+response.data.Body.Rubro.Codigo+" / "+response.data.Body.Rubro.Nombre ,response.data.Type);
              }

            }
          });
          $scope.datachangeevent = !$scope.datachangeevent;
        };

        self.ActualizarApr = function() {
          $("#ModalEdicionApr").modal('hide');
          financieraRequest.put('apropiacion/',self.apropiacionsel.Apropiacion.Id, self.apropiacionsel.Apropiacion).then(function(response){
            console.log(response.data);
            if (response.data.Type !== undefined){
              if (response.data.Type === "error"){
                swal('',$translate.instant(response.data.Code),response.data.Type);
              }else{
                swal('',$translate.instant(response.data.Code)+ " : "+$translate.instant('APROPIACION')+" : "+response.data.Body.Rubro.Codigo+" / "+response.data.Body.Rubro.Nombre ,response.data.Type);
              }

            }
          });
          $scope.datachangeevent = !$scope.datachangeevent;
        };
        
        
        $scope.$watch("filtro", function() {    
              if ($scope.filtro !== '' && $scope.filtro !== undefined){
                self.expandAllNodes($scope.arbol);
              }else{
                self.expandedNodes.length = 0;
              }
             
             
           
        }, true);
        
        
        /*$scope.$watch("vigencia", function() {
          self.cargar_arbol();
          if ($scope.filtro !== '' && $scope.filtro !== undefined){
            self.expandAllNodes($scope.arbol);
          }else{
            self.expandedNodes.length = 0;
          }
        }, true);*/

        $scope.$watch("recargar", function() {
          self.cargar_arbol();
          if ($scope.filtro !== '' && $scope.filtro !== undefined){
            self.expandAllNodes($scope.arbol);
          }else{
            self.expandedNodes.length = 0;
          }
        }, true);

        $scope.showSelected = function(node, $path) {
          $scope.ramasel = $path();
        };
        self.cargar_arbol();
      },
      controllerAs:'d_apropiacionConsulta'
    };
  });
