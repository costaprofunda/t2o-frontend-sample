/**
 * Created by cpro on 08.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('combo', combo);

    combo.$inject = [];

    function combo() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/combo.html',
            scope: {
                model: '=',
                errors: '=?',
                items: '=?',
                selectId: '@',
                filterName: '@',
                placeholder: '@',
                disabled: '=?',
                deselect: '@',
                noSearch: '@'
            },
            link: function (scope) {
                scope.items = scope.items || [];
                if (!!scope.items) {
                    if (!scope.items.length) {
                        var unregister = scope.$watch('items', function (newVal, oldVal) {
                            if (!oldVal.length) {
                                onModelChange();
                                if (!!newVal.length) {
                                    unregister();
                                }
                            }
                        });
                    }
                    else {
                        onModelChange();
                    }
                }

                function onModelChange() {
                    if (!!scope.model && !!scope.model.id) {
                        scope.items.forEach(function (item) {
                            if (angular.equals(item.id, scope.model.id)) {
                                scope.model = item;
                            }
                        });
                    }
                }
            }
        };
    }

})();