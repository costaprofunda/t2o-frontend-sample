/**
 * Created by cpro on 05.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .factory('CategoryService', CategoryService);

    CategoryService.$inject = ['Restangular'];

    function CategoryService(Restangular) {

        var service = {
            getCategoryTree: getCategoryTree,
            getCategoryChildList: getCategoryChildList
        };

        function getCategoryTree() {
            return Restangular.all('tree').getList();
        }

        function getCategoryChildList(tree, parentPropName) {
            var list = [];
            tree.forEach(function (root) {
                root.children.forEach(function (leaf) {
                    leaf[parentPropName] = root.name;
                    leaf.parentId = root.id;
                    list.push(leaf);
                });
            });
            return list;
        }

        return service;

    }

})();