/**
 * Created by cpro on 22.09.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('property', property);

    property.$inject = ['$filter'];

    function property($filter) {

        var parseString = function (input) {
            return input.split(".");
        };

        function getValue(element, propertyArray) {
            var value = element;

            angular.forEach(propertyArray, function (property) {
                value = value[property];
            });

            return value;
        }

        return function (array, propertyString, target) {
            var properties = parseString(propertyString);

            return $filter('filter')(array, function (item) {
                return getValue(item, properties) == target;
            });
        }

    }

})();