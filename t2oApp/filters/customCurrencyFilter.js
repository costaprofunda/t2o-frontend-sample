/**
 * Created by cpro on 08.09.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('customCurrency', customCurrency);

    customCurrency.$inject = [];

    function customCurrency() {

        return function (input) {
            var value = parseFloat(input);
            if (value % 1 === 0) {
                value = value.toFixed(0);
            }
            else {
                value = value.toFixed(2);
            }
            return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    }

})();