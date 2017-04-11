/**
 * Created by cpro on 20.02.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('PlanInfoModalInstanceController', PlanInfoModalInstanceController);

    PlanInfoModalInstanceController.$inject = ['$uibModalInstance', 'info', 'edit', 'categoryName', 'categoryList'];

    function PlanInfoModalInstanceController($uibModalInstance, info, edit, categoryName, categoryList) {
        var vmPlanInfo = this;

        vmPlanInfo.info = info;
        vmPlanInfo.edit = edit;
        vmPlanInfo.categoryName = categoryName;
        vmPlanInfo.categoryList = categoryList;
        vmPlanInfo.newInfo = angular.copy(vmPlanInfo.info);
        vmPlanInfo.infoEditing = false;

        vmPlanInfo.cancel = cancel;
        vmPlanInfo.save = save;
        vmPlanInfo.exitPlanInfoEdit = exitPlanInfoEdit;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            $uibModalInstance.close(vmPlanInfo.newInfo);
        }

        function exitPlanInfoEdit() {
            vmPlanInfo.infoEditing = false;
            vmPlanInfo.newInfo = angular.copy(vmPlanInfo.info);
        }
    }

})();