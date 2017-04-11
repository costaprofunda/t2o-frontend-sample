/**
 * Created by cpro on 08.09.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('filterProxy', filterProxy);

    filterProxy.$inject = ['$filter'];

    function filterProxy($filter) {
        return function (value, name) {
            if (!name) return value;
            return $filter(name)(value);
        };
    }

})();