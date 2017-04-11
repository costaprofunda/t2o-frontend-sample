/**
 * Created by cpro on 08.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('planFieldInput', planFieldInput);

    planFieldInput.$inject = [];

    function planFieldInput() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            templateUrl: 'directives/planFieldInput.html',
            scope: {
                errors: '=?',
                required: '@',
                tip: '@',
                getErrorList: '&',
                tooltipBottom: '@'
            },
            link: function (scope) {
                scope.getErrorList = getErrorList;

                function getErrorList() {
                    var message = "";
                    angular.forEach(scope.errors, function (error, index) {
                        message += (index > 0) ? ("\n" + error) : error;
                    });
                    return message;
                }
            }
        };
    }

})();