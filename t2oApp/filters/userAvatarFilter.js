/**
 * Created by cpro on 26.09.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('userAvatar', userAvatar);

    userAvatar.$inject = [];

    function userAvatar() {

        return function (user) {
            if (!user) return "";
            return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        }

    }

})();