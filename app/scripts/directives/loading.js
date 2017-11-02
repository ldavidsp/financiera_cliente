'use strict';

/**
 * @ngdoc directive
 * @name financieraClienteApp.directive:loading
 * @description
 * # loading
 */
angular.module('financieraClienteApp')
  .directive('loading', function () {
    return {
      restrict: 'E',
      scope:{
          load:'=',
          tam:'=?'
        },
      template: '<div class="loading" ng-show="load">' +
                   '<i class="fa fa-clock-o fa-spin fa-{{tam}}x faa-burst animated " aria-hidden="true" ></i>' +
                   '</div>',
      controller:function($scope){
        if ($scope.tam===undefined) {
          $scope.tam=5;
        }
      }
    };
  });
