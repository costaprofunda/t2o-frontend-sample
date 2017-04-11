/**
 * Created by cpro on 13.10.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('alternative', alternative);

    alternative.$inject = [];

    function alternative() {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/alternative.html',
            scope: {
                newItem: '=',
                submit: '=',
                type: '=',
                errors: '=?'
            },
            link: function (scope) {
                var onSubmit = scope.submit;
                scope.submit = function () {
                    scope.errors = {};
                    for (var prop in scope.newItem) {
                        scope.errors[prop] = [];
                    }
                    var valid = true;
                    if (!scope.newItem.name) {
                        scope.errors.name.push('Name should not be empty');
                        valid = false;
                    }
                    if (!!scope.type && (scope.type.identity !== 'POLICY') && !scope.newItem.price) {
                        scope.errors.price.push('All inclusive price has to be entered');
                        valid = false;
                    }
                    if (angular.isUndefined(scope.newItem.email)) {
                        scope.errors.email.push('Invalid email address');
                        valid = false;
                    }
                    if (!valid) return;
                    onSubmit();
                }
            }
        };
    }

})();