/**
 * Created by cpro on 27.02.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('replyMessageBox', replyMessageBox);

    replyMessageBox.$inject = [];

    function replyMessageBox() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/replyMessageBox.html',
            scope: {
                model: '=?',
                user: '=?',
                onCancelReply: '&',
                postReply: '&',
                caption: '@'
            },
            link: function (scope) {

            }
        };
    }

})();