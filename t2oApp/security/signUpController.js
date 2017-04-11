/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendSecurity')
        .controller('SignUpController', SignUpController);

    SignUpController.$inject = ['$state', '$uibModal'];

    function SignUpController($state, $uibModal) {
        $uibModal.open({
            templateUrl: 'security/signUpModal.html',
            controller: 'SignUpModalInstanceController',
            controllerAs: 'vmSignUp',
            backdrop: 'static'
        }).result.then(function () {
                $state.go('home.itemList', {}, {reload: true});
            }, function () {
                $state.go('home');
            });
    }

})();