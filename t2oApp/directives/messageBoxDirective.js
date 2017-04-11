/**
 * Created by cpro on 25.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('messageBox', messageBox);

    messageBox.$inject = [];

    function messageBox() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/messageBox.html',
            scope: {
                model: '=',
                placeholder: '@',
                post: '&',
                cancel: '&',
                disabled: '&',
                edit: '=?'
            },
            link: function (scope) {
                
            }
        };
    }

})();