/**
 * Created by cpro on 13.10.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('title', title);

    title.$inject = [];

    function title() {

        return function (value) {
            if ((!value) || (!value.title)) return 'title';
            return value.title;
        }

    }

})();