/**
 * Created by cpro on 14.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .factory('LocationService', LocationService);

    LocationService.$inject = ['$q', '$http'];

    function LocationService($q, $http) {

        var nominatimReverseGeocodingUrl =  'http://nominatim.openstreetmap.org/reverse';

        var service = {
            getCurrentPosition: getCurrentPosition,
            getLocationInfoByCoords: getLocationInfoByCoords
        };

        function getCurrentPosition() {
            var deferred = $q.defer();
            if (!!navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    deferred.resolve(position);
                });
            }
            else {
                deferred.reject();
            }
            return deferred.promise;
        }

        //withCredentials: true

        function getLocationInfoByCoords(latitude, longitude, nameDetails) {
            var deferred = $q.defer();
            $http.get(nominatimReverseGeocodingUrl, {
                params: {
                    format: 'json',
                    lat: latitude,
                    lon: longitude,
                    //'accept-language': 'en',
                    namedetails: (!nameDetails ? 0 : 1),
                    addressdetails: 1
                }
            }).success(function (data) {
                //console.log("data: ", data);
                if (!!data.address && !!data.address.house_number) {
                    data.display_name = data.display_name.replace(data.address.house_number + ', ', '');
                }
                deferred.resolve(data)
            });
            return deferred.promise;
        }

        return service;

    }

})();