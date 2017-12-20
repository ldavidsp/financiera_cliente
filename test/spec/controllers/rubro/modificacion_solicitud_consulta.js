'use strict';

describe('Controller: RubroModificacionSolicitudConsultaCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var RubroModificacionSolicitudConsultaCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RubroModificacionSolicitudConsultaCtrl = $controller('RubroModificacionSolicitudConsultaCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RubroModificacionSolicitudConsultaCtrl.awesomeThings.length).toBe(3);
  });
});
