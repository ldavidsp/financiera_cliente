'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl
 * @description
 * # OrdenPagoSeguridadSocialOpSeguridadSocialCrearCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
  .controller('OpSeguridadSocialCrearCtrl', function($scope, financieraRequest, $window, $translate, financieraMidRequest, titanRequest, $http) {
    var self = this;
    self.PestanaAbierta = true;
    self.OrdenPago = {};
    self.DataSeguridadSocial = {};
    self.registroPresupuestal = {};

    // obtener vigencia
    financieraRequest.get("orden_pago/FechaActual/2006") //formato de entrada  https://golang.org/src/time/format.go
      .then(function(data) { //error con el success
        self.OrdenPago.Vigencia = parseInt(data.data);
        self.DataSeguridadSocial.Vigencia = self.OrdenPago.Vigencia;
      })
    //
    $scope.$watch('opSeguridadSocialCrear.registroPresupuestal', function() {
      if (Object.keys(self.registroPresupuestal).length > 0) {
        financieraRequest.get('registro_presupuestal/ValorTotalRp/' + self.registroPresupuestal.Id)
          .then(function(response) {
            self.registroPresupuestal.Valor = response.data;
          });
      }
    })

    // ***************
    // Funciones
    // ***************
    self.validar_campos = function() {
      self.MensajesAlerta = '';
      if (self.OrdenPago.UnidadEjecutora == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_UNIDAD') + "</li>"
      }
      if (self.OrdenPago.RegistroPresupuestal == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_REGISTRO') + "</li>"
      }
      if (self.DataSeguridadSocial.Mes == undefined) {
        self.MensajesAlerta = self.MensajesAlerta + "<li>" + $translate.instant('MSN_DEBE_MES_SS') + "</li>"
      }
      // Operar
      if (self.MensajesAlerta == undefined || self.MensajesAlerta.length == 0) {
        // insertc
        console.log("Insertar DATA");
        console.log(self.dataSend);
        console.log("Insertar DATA");
        financieraMidRequest.post("orden_pago_nomina/CrearOPSeguridadSocial", self.dataSend)
          .then(function(data) {
            self.resultado = data;
            //mensaje
            swal({
              title: 'Orden de Pago',
              text: self.resultado.data.Type == 'success' ? $translate.instant(self.resultado.data.Code) + self.resultado.data.Body : $translate.instant(self.resultado.data.Code),
              type: self.resultado.data.Type,
            }).then(function() {
              $window.location.href = '#/orden_pago/ver_todos';
            })
            //
          })
      } else {
        // mesnajes de error
        swal({
          title: 'Error!',
          html: '<ol align="left">' + self.MensajesAlerta + '</ol>',
          type: 'error'
        })
      }
    }
    //
    self.addOpPlantaSsCrear = function() {
      console.log("funcion");
      if (self.OrdenPago.RegistroPresupuestal) {
        self.OrdenPago.ValorBase = self.OrdenPago.RegistroPresupuestal.ValorTotal; // se obtendra del rp
      }
      self.OrdenPago.PersonaElaboro = 1;
      // Data para enviar al servicio
      self.dataSend = {};
      self.dataSend.OrdenPago = self.OrdenPago;
      self.dataSend.SeguridadSocial = self.DataSeguridadSocial;
      self.validar_campos();
    }
  });
