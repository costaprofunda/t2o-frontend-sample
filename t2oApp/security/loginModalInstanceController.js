/**
 * Created by cpro on 05.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendSecurity')
        .controller('LoginModalInstanceController', LoginModalInstanceController);

    LoginModalInstanceController.$inject = ['$uibModalInstance', 'SecurityService'];

    function LoginModalInstanceController($uibModalInstance, SecurityService) {
        var vmLogin = this;

        vmLogin.errorMessage = '';
        vmLogin.credentials = {
            email: '',
            password: ''
        };

        vmLogin.cancel = cancel;
        vmLogin.login = login;
        vmLogin.facebookLogin = facebookLogin;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function login() {
            SecurityService.authenticate(vmLogin.credentials).then(function () {
                $uibModalInstance.close();
            }, function (error) {
                if (!!error.result.message) {
                    console.log("error.message: ", error.result.message);
                    vmLogin.errorMessage = error.result.message;
                }
            });
        }

        function facebookLogin() {
            SecurityService.loginUsingFacebook().then(function () {
                $uibModalInstance.close();
            });
        }
    }

})();