'use strict';

describe('Directive: usuario/accionesRegistro', function () {

  // load the directive's module
  beforeEach(module('financieraClienteApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<usuario/acciones-registro></usuario/acciones-registro>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the usuario/accionesRegistro directive');
  }));
});
