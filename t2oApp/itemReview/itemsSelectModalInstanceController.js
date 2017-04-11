/**
 * Created by cpro on 18.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('ItemsSelectModalInstanceController', ItemsSelectModalInstanceController);

    ItemsSelectModalInstanceController.$inject = ['$uibModalInstance', 'items', 'types'];

    function ItemsSelectModalInstanceController($uibModalInstance, items, types) {
        var vmItemsSelect = this;

        vmItemsSelect.types = types;
        vmItemsSelect.items = items;

        vmItemsSelect.cancel = cancel;
        vmItemsSelect.save = save;
        vmItemsSelect.selectAllItems = selectAllItems;


        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save() {
            var selectedObjIds = [];
            vmItemsSelect.items.forEach(function (item) {
                if (item.selected) {
                    selectedObjIds.push(item.objId);
                }
            });
            $uibModalInstance.close(selectedObjIds);
        }

        function selectAllItems(selected) {
            vmItemsSelect.items.forEach(function (item) {
                item.selected = selected;
            });
        }
    }

})();