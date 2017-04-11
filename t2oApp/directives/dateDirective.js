/**
 * Created by cpro on 10.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('date', date);

    date.$inject = [];

    function date() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/date.html',
            scope: {
                model: '=',
                placeholder: '@',
                minDate: '=?',
                datePickerIsOpened: '=?',
                openDatePicker: '&',
                change: '&'
            },
            link: function (scope) {
                scope.datePickerIsOpened = false;
                scope.openDatePicker = openDatePicker;

                function openDatePicker(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    scope.datePickerIsOpened = true;
                }
            }
        };
    }

})();