/**
 * Created by cpro on 09.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('AlternativeModalInstanceController', AlternativeModalInstanceController);

    AlternativeModalInstanceController.$inject = ['$uibModalInstance', 'item', 'type', 'firstItem'];

    function AlternativeModalInstanceController($uibModalInstance, item, type, firstItem) {
        var vmAlternative = this;

        vmAlternative.type = type;

        if (!item) {
            vmAlternative.alternative = {
                url: '',
                name: '',
                price: '',
                reoccurringPrice: false,
                provider: '',
                contactName: '',
                phone: '',
                email: '',
                description: '',
                goodDeal: ''
            };
            vmAlternative.title = (!firstItem) ? "Add an Alternative" : "Add an Answer";
            vmAlternative.actionTitle = "Add";
        }
        else {
            vmAlternative.alternative = item;
            vmAlternative.title = "Edit";
            vmAlternative.actionTitle = "Update";
            if (type.identity !== 'POLICY') {
                vmAlternative.alternative.price = '$' + vmAlternative.alternative.price;
            }
        }


        vmAlternative.cancel = cancel;
        vmAlternative.save = save;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            if (!angular.isNumber(vmAlternative.alternative.price)) {
                vmAlternative.alternative.price = parseFloat(vmAlternative.alternative.price.replace(/[^\d.]/g, ''));
            }
            if (!vmAlternative.alternative.price) {
                vmAlternative.alternative.price = 0;
            }
            $uibModalInstance.close(vmAlternative.alternative);
        }
    }

})();