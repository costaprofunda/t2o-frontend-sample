/**
 * Created by cpro on 07.04.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendUserProfile')
        .controller('ContactInfoModalInstanceController', ContactInfoModalInstanceController);

    ContactInfoModalInstanceController.$inject = ['$uibModalInstance', 'info'];

    function ContactInfoModalInstanceController($uibModalInstance, info) {
        var vmContactInfo = this;
        
        vmContactInfo.info = info;
        vmContactInfo.errors = { email: [] };

        vmContactInfo.cancel = cancel;
        vmContactInfo.save = save;

        function isValid(info, errors) {
            var valid = true;
            if (!info.email) {
                errors.email.push("Invalid email");
                valid = false;
            }
            return valid;
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            if (!isValid(vmContactInfo.info, vmContactInfo.errors)) {
                return;
            }
            $uibModalInstance.close(vmContactInfo.info);
        }
    }

})();