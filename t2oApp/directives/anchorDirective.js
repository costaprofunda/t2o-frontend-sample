/**
 * Created by cpro on 12.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('anchor', anchor);

    anchor.$inject = [];

    function anchor() {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                return elem.bind('click', function () {
                    return document.getElementById(attrs['anchor']).scrollIntoView();
                });
            }
        };
    }

})();