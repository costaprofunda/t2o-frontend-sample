/**
 * Created by cpro on 17.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('ShareRequestModalInstanceController', ShareRequestModalInstanceController);

    ShareRequestModalInstanceController.$inject = ['$uibModalInstance', 'openedShares', 'totalShares', 'userSharesPlan'];

    function ShareRequestModalInstanceController($uibModalInstance, openedShares, totalShares, userSharesPlan) {
        var vmShareRequest = this;

        vmShareRequest.openedShares = openedShares;
        vmShareRequest.totalShares = totalShares;
        vmShareRequest.userSharesPlan = userSharesPlan;
        vmShareRequest.request = {
            message: '',
            shares: 1,
            lowerShares: true
        };

        vmShareRequest.errors = {shares: []};

        vmShareRequest.cancel = cancel;
        vmShareRequest.send = send;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function send() {
            if (!isValid()) return;
            $uibModalInstance.close(vmShareRequest.request);
        }

        function isValid() {
            var isValid = true;
            if (!vmShareRequest.request.shares || (vmShareRequest.request.shares >= vmShareRequest.totalShares)) {
                vmShareRequest.errors.shares.push("Value of shares should be less than total shares quantity");
                isValid = false;
            }
            return isValid;
        }
    }

})();