/**
 * Created by cpro on 26.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendUserProfile')
        .controller('ChangePasswordModalInstanceController', ChangePasswordModalInstanceController);

    ChangePasswordModalInstanceController.$inject = ['$uibModalInstance', 'SecurityService', 'userInfo'];

    function ChangePasswordModalInstanceController($uibModalInstance, SecurityService, userInfo) {
        var vmChangePassword = this;

        vmChangePassword.blankPassword = userInfo.blankPassword;
        vmChangePassword.passwordConfirmation = '';
        vmChangePassword.passwordData = {
            newPassword: ''
        };

        vmChangePassword.cancel = cancel;
        vmChangePassword.save = save;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            vmChangePassword.errors = {
                oldPassword: [],
                newPassword: [],
                passwordConfirmation: []
            };
            var valid = true;
            if (!vmChangePassword.blankPassword && !vmChangePassword.passwordData.oldPassword) {
                valid = false;
                vmChangePassword.errors.oldPassword.push("No data entered");
            }
            if (!vmChangePassword.passwordData.newPassword) {
                valid = false;
                vmChangePassword.errors.newPassword.push("No data entered");
            }
            if (vmChangePassword.passwordConfirmation !== vmChangePassword.passwordData.newPassword) {
                valid = false;
                var errorMessageText = "New password does not match with its confirmation";
                vmChangePassword.errors.passwordConfirmation.push(errorMessageText);
                vmChangePassword.errors.newPassword.push(errorMessageText);
            }
            if (!valid) return;
            SecurityService.setNewPassword(userInfo.id, vmChangePassword.passwordData).then(function () {
                $uibModalInstance.close();
            });
        }
    }

})();