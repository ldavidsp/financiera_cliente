'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosSinSituacionFondosRegistroCtrl
 * @description
 * # IngresosSinSituacionFondosRegistroCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('IngresosSinSituacionFondosRegistroCtrl', function ($scope,financieraRequest, presupuestoRequest,$translate,financieraMidRequest,presupuestoMidRequest,$location) {
    var ctrl  = this;
    ctrl.disabled = false;

    ctrl.cargarListas = function(){

      presupuestoRequest.get('unidad_ejecutora', $.param({
          limit: -1
      })).then(function(response) {
          ctrl.unidadesejecutoras = response.data;
      });

      presupuestoRequest.get("orden_pago/FechaActual/2006").then(function(response) {
        var year = parseInt(response.data);
        ctrl.anos = [];
        for (var i = 0; i < 5; i++) {
          ctrl.anos.push(year - i);
        }
      });
    }


    ctrl.cargarListas();

    ctrl.validateFields = function(){

      if($scope.datosOblig.$invalid){
        angular.forEach($scope.datosOblig.$error,function(controles,error){
          angular.forEach(controles,function(control){
            control.$setDirty();
          });
        });

        swal("", $translate.instant("CAMPOS_OBLIGATORIOS"),"error");
        return false;

      }

      if(angular.isUndefined(ctrl.rubroSeleccionado)){
        swal("", $translate.instant("E_RB003"),"error");
        return false;
      }

      if (ctrl.rubroSeleccionado.Hijos != null) {
        swal("",$translate.instant("E_ISF001"),"error");
        return false;
      }
    }

    ctrl.registrar = function(){
      var request = {};

      var validar_campos = ctrl.validateFields();
      if(validar_campos != false){
        ctrl.disabled = true;
        request = {
          IngresoSinSituacionFondos:{
            Rubro:{},
            Vigencia:ctrl.vigencia,
            UsuarioRegistro:1111,
            UnidadEjecutora:ctrl.unidadejecutora.Id,
            ValorIngreso:ctrl.valor
          }
        }


        request.IngresoSinSituacionFondos.Rubro.Id = parseInt(ctrl.rubroSeleccionado.Id);
        presupuestoMidRequest.post('ingreso_sin_situacion_fondos',request).then(function(response){

          if(response.data===null){
            swal("",$translate.instant("E_ISF002"),"error");
          }

          /* Se deja pendiente ya que api no retorna estructura de error
          if(response.data.Type==="error"){
            swal("",$translate.instant(response.data.Code),response.data.Type);
          }
          */
          else{
            var templateAlert = "<table class='table table-bordered'><tr><th>" + $translate.instant('CONSECUTIVO') + "</th></tr>";
            templateAlert = templateAlert + "<tr class='success'><td>" + response.data.Body.Id + "</td></tr>" ;
            swal('',templateAlert,response.data.Type).then(function(){
              $scope.$apply(function(){
                  $location.path('/ingresos_sin_situacion_fondos/consulta');
              });
            });

          }
          ctrl.disabled = false;
        });

      }
    }

  });
