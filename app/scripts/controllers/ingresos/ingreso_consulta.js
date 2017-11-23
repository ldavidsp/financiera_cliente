'use strict';

/**
 * @ngdoc function
 * @name financieraClienteApp.controller:IngresosIngresoConsultaCtrl
 * @description
 * # IngresosIngresoConsultaCtrl
 * Controller of the financieraClienteApp
 */
angular.module('financieraClienteApp')
    .controller('IngresosIngresoConsultaCtrl', function(financieraRequest, wso2Request, pagosRequest, $filter, $scope, $translate, $localStorage) {
        var ctrl = this;
        $scope.doc = 0;
        $scope.estados = [];
        $scope.estado_select = [];
        $scope.aristas = [];
        $scope.estadoclick = {};
        ctrl.ingresoSel = null;

        $scope.botones = [
            { clase_color: "ver", clase_css: "fa fa-eye fa-lg  faa-shake animated-hover", titulo: $translate.instant('BTN.VER'), operacion: 'ver', estado: true },
            { clase_color: "editar", clase_css: "fa fa-product-hunt fa-lg faa-shake animated-hover", titulo: $translate.instant('PROCESO'), operacion: 'proceso', estado: true }
        ];


        ctrl.gridOptions_ingresosbanco = {
            enableRowSelection: true,
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 1,
            paginationPageSizes: [5, 10, 15],
            paginationPageSize: 5,
            useExternalPagination: false,
            enableFiltering: true,
            rowHeight: 45
        };

        ctrl.gridOptions = {
            enableHorizontalScrollbar: 0,
            enableVerticalScrollbar: 1,
            paginationPageSizes: [5, 10, 15],
            paginationPageSize: 5,
            useExternalPagination: false,
            enableFiltering: true,
            rowHeight: 45
        };
        ctrl.gridOptions.columnDefs = [{
                field: 'Id',
                visible: false
            }, {
                field: 'Vigencia',
                displayName: $translate.instant("VIGENCIA"),
                headerCellClass: 'text-info'
            },
            {
                field: 'Consecutivo',
                displayName: $translate.instant("CONSECUTIVO"),
                headerCellClass: 'text-info'
            },
            {
                field: 'FechaIngreso',
                displayName: $translate.instant("FECHA_INGRESO"),
                headerCellClass: 'text-info',
                cellTemplate: '<span>{{row.entity.FechaIngreso | date:"yyyy-MM-dd":"UTC"}}</span>'
            },
            {
                field: 'FechaConsignacion',
                displayName: $translate.instant("FECHA_CONSIGNACION"),
                headerCellClass: 'text-info',
                cellTemplate: '<span>{{row.entity.FechaConsignacion | date:"yyyy-MM-dd":"UTC"}}</span>'
            },
            {
                field: 'FormaIngreso.Nombre',
                displayName: $translate.instant("FORMA_INGRESO"),
                headerCellClass: 'text-info'
            },
            {
                field: 'EstadoIngreso.Nombre',
                displayName: $translate.instant("ESTADO"),
                headerCellClass: 'text-info'
            },
            {
                name: $translate.instant('OPCIONES'),
                enableFiltering: false,
                width: '8%',
                cellTemplate: '<center><btn-registro funcion="grid.appScope.loadrow(fila,operacion)" grupobotones="grid.appScope.botones" fila="row"></btn-registro></center>'
            }
        ];

        $scope.funcion = function() {
            $scope.estadoclick = $localStorage.nodeclick;
            switch ($scope.estadoclick.Id) {
                case (3):
                    ctrl.verIngreso(row.entity);
                    break;
                case (2):
                    $scope.estado = row.entity.EstadoIngreso;
                    break;
            }
        };

        $scope.loadrow = function(row, operacion) {
            $scope.ingreso = row.entity;
            switch (operacion) {
                case "ver":
                    ctrl.ver_ingreso(row.entity);
                    break;
                case "proceso":
                    $scope.estado = row.entity.EstadoIngreso;
                    break;
            }
        };

        ctrl.consultarPagos = function(data) {
            console.log(data);
            var date = data.FechaConsignacion;
            var tipo_recibo = data.FormaIngreso.Nombre;

            ctrl.rta = null;
            ctrl.pagos = null;
            ctrl.cargandoDatosPagos = true;

            switch (tipo_recibo) {
                case "Inscripciones":
                    ctrl.gridOptions_ingresosbanco.columnDefs = [
                        { name: 'identificacion', displayName: 'Identificación', headerCellClass: 'text-info' },
                        { name: 'fecha', displayName: 'Fecha', headerCellClass: 'text-info' },
                        //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                        { name: 'valor', displayName: 'Valor', headerCellClass: 'text-info', cellFilter: 'currency' },
                        { name: 'codigo_banco', displayName: 'Codigo del Banco', headerCellClass: 'text-info' },
                        { name: 'oficina_banco', displayName: 'Oficina del Banco', headerCellClass: 'text-info' },
                        { name: 'referencia_pago', displayName: 'Referencia del Pago', headerCellClass: 'text-info', cellFilter: 'currency' }
                    ];
                    var inicio = $filter('date')(date, "yyyy-MM-dd");
                    var fin = $filter('date')(date, "yyyy-MM-dd");
                    var parametros = [{
                        name: "tipo_recibo",
                        value: "ingresos_admisiones"
                    }, {
                        name: "fecha_inicio",
                        value: inicio
                    }, {
                        name: "fecha_fin",
                        value: fin
                    }];
                    angular.forEach(ctrl.homologacion_facultad, function(facultad) {
                        if (facultad.new == parametros[1].value) {
                            parametros[1].value = facultad.old;
                        }
                    });
                    wso2Request.get("admisionesProxyServer", parametros).then(function(response) {
                        if (response != null) {
                            $scope.datos = true;
                            ctrl.gridOptions.data = response.data.ingresosAdmisionesCollection.ingresoAdmisiones;
                            ctrl.total = 0;
                            angular.forEach(ctrl.gridOptions.data, function(ingreso) {
                                ctrl.total += parseFloat(ingreso.referencia_pago);
                            });
                        } else {
                            $scope.datos = false;
                        }
                    });

                    break;
                case "CODIGO DE BARRAS":
                    ctrl.gridOptions_ingresosbanco.columnDefs = [
                        { name: 'ano', displayName: 'Vigencia', headerCellClass: 'text-info' },
                        { name: 'identificacion', displayName: 'Identificación', headerCellClass: 'text-info' },
                        { name: 'nombre', displayName: 'Nombre', headerCellClass: 'text-info' },
                        //{ name: 'CODIGO_CONCEPTO', displayName: 'Concepto'  },
                        { name: 'numero_cuenta', displayName: 'N° Cuenta', headerCellClass: 'text-info' },
                        { name: 'tipo_recibo', displayName: 'Tipo Recibo', headerCellClass: 'text-info' },
                        { name: 'pago_reportado', displayName: 'Pago Reportado', headerCellClass: 'text-info', cellFilter: 'currency' },
                        { name: 'matricula', displayName: 'Pago Matricula', headerCellClass: 'text-info', cellFilter: 'currency' },
                        { name: 'seguro', displayName: 'Pago Seguro', headerCellClass: 'text-info', cellFilter: 'currency' },
                        { name: 'carnet', displayName: 'Pago Carnet', headerCellClass: 'text-info', cellFilter: 'currency' }
                    ];
                    var inicio = $filter('date')(date, "dd-MM-yy");
                    var fin = $filter('date')(date, "dd-MM-yy");
                    var parametros = [{
                        name: "tipo_recibo",
                        value: "ingresos_concepto/CODIGO%20DE%20BARRAS"
                    }, {
                        name: "facultad",
                        value: codigo_facultad
                    }, {
                        name: "fecha_inicio",
                        value: inicio
                    }, {
                        name: "fecha_fin",
                        value: fin
                    }];
                    angular.forEach(ctrl.homologacion_facultad, function(facultad) {
                        if (facultad.new == parametros[1].value) {
                            parametros[1].value = facultad.old;
                        }
                    });
                    wso2Request.get("academicaProxyService", parametros).then(function(response) {
                        if (response != null) {
                            $scope.datos = true;
                            ctrl.gridOptions.data = response.data.ingresosConceptoCollection.ingresoConcepto;
                            ctrl.total = 0;
                            angular.forEach(ctrl.gridOptions.data, function(ingreso) {
                                ctrl.total += parseFloat(ingreso.pago_reportado);
                            });
                        } else {
                            $scope.datos = false;
                        }
                    });
                default:
                    break;
            }
        };


        ctrl.cargarIngresos = function() {
            financieraRequest.get('ingreso', $.param({
                limit: -1
            })).then(function(response) {
                ctrl.gridOptions.data = response.data;
            });
        };



        ctrl.cargarEstados = function() {
            financieraRequest.get("estado_ingreso", $.param({
                    sortby: "NumeroOrden",
                    limit: -1,
                    order: "asc"
                }))
                .then(function(response) {
                    $scope.estados = [];
                    $scope.aristas = [];
                    ctrl.estados = response.data;
                    angular.forEach(ctrl.estados, function(estado) {
                        $scope.estados.push({
                            id: estado.Id,
                            label: estado.Nombre
                        });
                        $scope.estado_select.push({
                            value: estado.Nombre,
                            label: estado.Nombre,
                            estado: estado
                        });
                    });
                    $scope.aristas = [{
                            from: 1,
                            to: 2
                        },
                        {
                            from: 1,
                            to: 3
                        }
                    ];
                });
        };


        ctrl.cargarIngresos();
        ctrl.cargarEstados();

        ctrl.ver_ingreso = function(row) {
            ctrl.ingresoSel = row;
            $scope.documm = row.Id;
            ctrl.consultarPagos(row);
            $("#myModal").modal();
        };

        ctrl.aprobar = function() {
            var aprobardata = {};
            aprobardata.Ingreso = ctrl.ingresoSel;
            aprobardata.Movimientos = $scope.movimientos;
            console.log(aprobardata);
            console.log(aprobardata.Ingreso);
            financieraRequest.post('ingreso/AprobarIngreso', aprobardata).then(function(response) {
                console.log(response.data);
                if (response.data.Type !== undefined) {
                    if (response.data.Type === "error") {
                        swal('', $translate.instant(response.data.Code), response.data.Type);
                    } else {
                        swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {
                            $("#myModal").modal('hide');
                            ctrl.cargarIngresos();
                        });
                    }

                }
            });
        };


        ctrl.rechazar = function() {
            $("#myModal").modal('hide');
            swal({
                title: 'Indica una justificación por el rechazo',
                input: 'textarea',
                showCancelButton: true,
                inputValidator: function(value) {
                    return new Promise(function(resolve, reject) {
                        if (value) {
                            resolve();
                        } else {
                            reject('Por favor indica una justificación!');
                        }
                    });
                }
            }).then(function(text) {
                console.log(text);
                console.log(ctrl.ingresoSel);
                ctrl.ingresoSel.MotivoRechazo = text;
                financieraRequest.post('ingreso/RechazarIngreso', ctrl.ingresoSel).then(function(response) {
                    console.log(response.data);
                    if (response.data.Type !== undefined) {
                        if (response.data.Type === "error") {
                            swal('', $translate.instant(response.data.Code), response.data.Type);
                            ctrl.cargarIngresos();
                        } else {
                            swal('', $translate.instant(response.data.Code) + response.data.Body.Consecutivo, response.data.Type).then(function() {
                                ctrl.cargarIngresos();
                            });
                        }

                    }

                });

            });
        };

    });