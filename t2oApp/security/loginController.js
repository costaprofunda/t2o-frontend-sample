/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendSecurity')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$state', '$uibModal', 'ReturnLocationStorageService'];

    function LoginController($state, $uibModal, ReturnLocationStorageService) {
        $uibModal.open({
            templateUrl: 'security/loginModal.html',
            controller: 'LoginModalInstanceController',
            controllerAs: 'vmLogin',
            backdrop: 'static'
        }).result.then(function () {
                var stateName = ReturnLocationStorageService.getStateName();
                var stateParams = ReturnLocationStorageService.getParams();
                $state.go(stateName, stateParams, {reload: true});
            }, function () {
                $state.go('home');
            });
    }

})();