/**
 * Created by cpro on 17.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .controller('ConfirmationModalInstanceController', ConfirmationModalInstanceController);

    ConfirmationModalInstanceController.$inject = ['$uibModalInstance', 'message', 'type', 'yesNo'];

    function ConfirmationModalInstanceController($uibModalInstance, message, type, yesNo) {
        var vmConfirmation = this;

        vmConfirmation.message = message;
        vmConfirmation.type = type;
        vmConfirmation.yesNo = yesNo;

        vmConfirmation.cancel = cancel;
        vmConfirmation.confirm = confirm;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function confirm() {
            $uibModalInstance.close();
        }

    }

})();