/**
 * Created by cpro on 22.10.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('ScrapModalInstanceController', ScrapModalInstanceController);

    ScrapModalInstanceController.$inject = ['$uibModalInstance'];

    function ScrapModalInstanceController($uibModalInstance) {
        var vmScrap = this;

        vmScrap.scrap = {
            reason: ''
        };

        vmScrap.cancel = cancel;
        vmScrap.save = save;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            vmScrap.errors = {
                reason: []
            };
            if (!vmScrap.scrap.reason || (vmScrap.scrap.reason.length < 5)) {
                vmScrap.errors.reason.push('More clear explanation required');
                return;
            }
            $uibModalInstance.close(vmScrap.scrap);
        }
    }

})();