/**
 * Created by cpro on 16.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('autoFocus', autoFocus);

    autoFocus.$inject = ['$timeout'];

    function autoFocus($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                $timeout(function () {
                    element[0].focus();
                }, 100);
            }
        };
    }

})();