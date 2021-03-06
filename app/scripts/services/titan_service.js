'use strict';

/**
 * @ngdoc service
 * @name financieraClienteApp.titanService
 * @description
 * # titanService
 * Factory in the financieraClienteApp.
 */
angular.module('titanService', [])
    .factory('titanRequest', function($http, CONF) {
        // Service logic
        // ...
        var path = CONF.GENERAL.TITAN_SERVICE;

        // Public API here
        return {
            get: function(tabla, params) {
                return $http.get(path + tabla + "/?" + params);
            },
            post: function(tabla, elemento) {
                return $http.post(path + tabla, elemento);
            },
            put: function(tabla, id, elemento) {
                return $http.put(path + tabla + "/" + id, elemento);
            },
            delete: function(tabla, id) {
                return $http.delete(path + tabla + "/" + id);
            }
        };

    });
