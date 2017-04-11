/**
 * Created by cpro on 21.10.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('yesNo', yesNo);

    yesNo.$inject = [];

    function yesNo() {

        return function (value) {
            return (!value) ? 'No' : 'Yes';
        }

    }

})();