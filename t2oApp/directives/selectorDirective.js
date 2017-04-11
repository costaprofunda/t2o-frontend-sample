/**
 * Created by cpro on 09.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('selector', selector);

    selector.$inject = [];

    function selector() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/selector.html',
            scope: {
                model: '=',
                errors: '=?',
                items: '=?',
                selectId: '@',
                filterName: '@',
                disabled: '=?',
                required: '@',
                onClick: '&'
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
                scope.onClick = onClick;

                function onClick(item) {
                    if (!scope.disabled) {
                        scope.model = (!scope.selectId) ? (item) : (item.id);
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