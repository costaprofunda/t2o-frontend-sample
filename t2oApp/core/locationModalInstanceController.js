/**
 * Created by cpro on 14.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .controller('LocationModalInstanceController', LocationModalInstanceController);

    LocationModalInstanceController.$inject = ['$scope', '$uibModalInstance', 'LocationService', 'UserProfileService', 'location', 'locationIndex'];

    function LocationModalInstanceController($scope, $uibModalInstance, LocationService, UserProfileService, location, locationIndex) {
        var vmLocation = this;

        vmLocation.title = !locationIndex ? 'Add Location Details' : 'Edit Location Details';

        if (!locationIndex) {
            vmLocation.place = {
                autoDiscover: true
            };
            vmLocation.info = null;
        }
        else {
            vmLocation.place = {
                lat: parseFloat(location.latitude),
                lng: parseFloat(location.longitude),
                zoom: 15
            };
            vmLocation.markers = [];
            vmLocation.markers.push({
                lat: parseFloat(location.latitude),
                lng: parseFloat(location.longitude),
                draggable: true
            });
            vmLocation.info = location.displayName;
        }


        vmLocation.cancel = cancel;
        vmLocation.ok = ok;
        vmLocation.locateMe = locateMe;
        vmLocation.searchForAddress = searchForAddress;

        $scope.$on('leafletDirectiveMap.click', function (event, args) {
            var leafEvent = args.leafletEvent;
            vmLocation.markers = [];
            vmLocation.markers.push({
                lat: leafEvent.latlng.lat,
                lng: leafEvent.latlng.lng,
                draggable: true
            });
            LocationService.getLocationInfoByCoords(leafEvent.latlng.lat, leafEvent.latlng.lng).then(function (info) {
                vmLocation.info = info.display_name;
            });
        });

        $scope.$on('leafletDirectiveMarker.dragend', function (event, args) {
            vmLocation.markers[0].lat = args.model.lat;
            vmLocation.markers[0].lng = args.model.lng;
            LocationService.getLocationInfoByCoords(args.model.lat, args.model.lng).then(function (info) {
                vmLocation.info = info.display_name;
            });
        });

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function ok() {
            LocationService.getLocationInfoByCoords(vmLocation.markers[0].lat, vmLocation.markers[0].lng, true).then(function (info) {
                var to = {
                    latitude: info.lat,
                    longitude: info.lon,
                    displayName: info.display_name
                };
                if (!location) {
                    UserProfileService.saveLocation(info.lat, info.lon, info.display_name).then(function () {
                        $uibModalInstance.close(to);
                    });
                }
                else {
                    if (!angular.equals(location, to)) {
                        UserProfileService.updateLocation(locationIndex, info.lat, info.lon, info.display_name).then(function () {
                            $uibModalInstance.close(to);
                        });
                    }
                    else {
                        $uibModalInstance.dismiss('cancel');
                    }
                }
            });
        }

        function locateMe() {
            LocationService.getCurrentPosition().then(function (position) {
                vmLocation.address = '';
                vmLocation.place = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    zoom: 15
                };
                LocationService.getLocationInfoByCoords(vmLocation.place.lat, vmLocation.place.lng).then(function (info) {
                    vmLocation.markers = [];
                    vmLocation.markers.push({
                        lng: vmLocation.place.lng,
                        lat: vmLocation.place.lat,
                        draggable: true
                    });
                    vmLocation.info = info.display_name;
                });
            });
        }

        function searchForAddress() {
            vmLocation.bounds = {
                address: vmLocation.address
            };
        }
    }

})();