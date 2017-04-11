/**
 * Created by cpro on 05.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendSecurity')
        .controller('SignUpModalInstanceController', SignUpModalInstanceController);

    SignUpModalInstanceController.$inject = ['$uibModalInstance', 'growl', 'Messages', 'SecurityService'];

    function SignUpModalInstanceController($uibModalInstance, growl, Messages, SecurityService) {
        var vmSignUp = this;

        vmSignUp.regData = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        };

        vmSignUp.cancel = cancel;
        vmSignUp.signUp = signUp;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function signUp() {
            var valid = true;
            for (var field in vmSignUp.regData) {
                if (!vmSignUp.regData[field]) {
                    valid = false;
                }
            }
            if (!valid) return;
            SecurityService.signUp(vmSignUp.regData).then(function () {
                growl.addSuccessMessage(Messages.registered);
                SecurityService.setAuthorized(true);
                $uibModalInstance.close();
            });
        }
    }

})();