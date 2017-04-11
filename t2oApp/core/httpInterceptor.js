/**
 * Created by cpro on 29.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .factory('HttpInterceptor', HttpInterceptor);

    HttpInterceptor.$inject = ['$q', '$rootScope', '$timeout', 'growl', 'Params', 'Events'];

    function HttpInterceptor($q, $rootScope, $timeout, growl, Params, Events) {

        var numLoadings = 0;
        var timeoutEvent;

        var service = {
            request: request,
            response: response,
            responseError: responseError
        };

        function request(config) {
            // Show loader
            if (config.url.indexOf("http://nominatim.openstreetmap.org/") !== -1) {
                config.withCredentials = false;
            }
            numLoadings++;
            timeoutEvent = $timeout(function () {
                if (!!numLoadings) {
                    $rootScope.$broadcast(Events.loaderShow);
                }
            }, Params.milliSecondsBeforeLoaderShow);
            return config || $q.when(config);
        }

        function response(response) {
            if ((--numLoadings) === 0) {
                // Hide loader
                $rootScope.$broadcast(Events.loaderHide);
                $timeout.cancel(timeoutEvent);
            }
            return response || $q.when(response);
        }

        function responseError(response) {
            if ((response.status === 401) && !!response.data) {
                $rootScope.$broadcast(Events.unauthorized);
            }

            if (!(--numLoadings)) {
                // Hide loader
                $rootScope.$broadcast(Events.loaderHide);
                $timeout.cancel(timeoutEvent);
            }

            if (!!response.data) {
                growl.addErrorMessage(response.data.result.status + ': ' + response.data.result.message);
            }

            return $q.reject(response);
        }

        return service;

    }

})();