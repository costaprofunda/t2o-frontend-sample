/**
 * Created by cpro on 24.02.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('planMember', planMember);

    planMember.$inject = [];

    function planMember() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/planMember.html',
            scope: {
                member: '=',
                user: '=',
                paid: '=',
                treasurer: '=',
                markAsPaid: '&'
            },
            link: function (scope) {
            }
        };
    }

})();