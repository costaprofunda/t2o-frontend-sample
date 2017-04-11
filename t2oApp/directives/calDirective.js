/**
 * Created by cpro on 28.02.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('cal', cal);

    cal.$inject = [];

    function cal() {
        return {
            restrict: 'E',
            replace: true,
            template: '<div class="cal"><span class="number" ng-bind="label"></span><img ng-src="resources/images/cal-blank.svg"></div>',
            scope: {
                label: '@'
            },
            link: function (scope) {
            }
        };
    }

})();