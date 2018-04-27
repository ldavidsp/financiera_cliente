'use strict';

describe('Controller: FuenteFinanciacionDetalleFuenteCtrl', function () {

  // load the controller's module
  beforeEach(module('financieraClienteApp'));

  var FuenteFinanciacionDetalleFuenteCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FuenteFinanciacionDetalleFuenteCtrl = $controller('FuenteFinanciacionDetalleFuenteCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FuenteFinanciacionDetalleFuenteCtrl.awesomeThings.length).toBe(3);
  });
});
