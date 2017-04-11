/**
 * Created by cpro on 14.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItems')
        .factory('ItemListService', ItemListService);

    ItemListService.$inject = ['Restangular'];

    function ItemListService(Restangular) {

        var service = {
            getItemList: getItemList
        };

        function getItemList(mine, categoryId, keyword, currentPage, pageSize) {
            var params = {
                mine: !!mine,
                current: currentPage,
                size: pageSize
            };
            if (!!categoryId) {
                params.categoryId = categoryId;
            }
            if (!!keyword) {
                params.keyword = keyword;
            }
            return Restangular.all('item-list').customGET('', params);
        }

        return service;

    }

})();