/**
 * Created by cpro on 09.09.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('productInfo', productInfo);

    productInfo.$inject = [];

    function productInfo() {
        return function (item) {
            return item.productName
                + (!!item.vendorName ? (' from ' + item.vendorName) : '');
        }
    }

})();