/**
 * Created by cpro on 08.09.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('name', name);

    name.$inject = [];

    function name() {
        return function (value) {
            if (!value) return 'name';
            if (!!value.name) return value.name;
            if ((!!value.firstName) && (!!value.lastName)) return value.firstName + " " + value.lastName;
            return 'name';
        }
    }

})();