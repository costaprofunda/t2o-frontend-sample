/**
 * Created by cpro on 28.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('confirm', confirm);

    confirm.$inject = ['$uibModal'];

    function confirm($uibModal) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: '',
            scope: {
                onClick: '&',
                text: '@'
            },
            link: function (scope, element) {
                element.bind('click', function () {
                    $uibModal.open({
                        templateUrl: 'directives/confirmModal.html',
                        controller: ['$uibModalInstance', 'text', function ($uibModalInstance, text) {

                            var vmConfirm = this;

                            vmConfirm.text = text;

                            vmConfirm.cancel = cancel;
                            vmConfirm.ok = ok;

                            function cancel() {
                                $uibModalInstance.dismiss('cancel');
                            }

                            function ok() {
                                $uibModalInstance.close();
                            }
                        }],
                        controllerAs: 'vmConfirm',
                        resolve: {
                            text: function () {
                                if (!scope.text) return 'Are you sure?';
                                return scope.text;
                            }
                        },
                        size: 'sm'
                    }).result.then(function () {
                        scope.onClick();
                    });
                });
            }
        };
    }

})();