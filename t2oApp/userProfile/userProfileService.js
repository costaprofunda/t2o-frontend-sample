/**
 * Created by cpro on 26.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendUserProfile')
        .service('UserProfileService', UserProfileService);

    UserProfileService.$inject = ['$q', 'Restangular'];

    function UserProfileService($q, Restangular) {

        this.getContactInformation = getContactInformation;
        this.editContactInformation = editContactInformation;
        this.getInterests = getInterests;
        this.addUserReview = addUserReview;
        this.getReviewList = getReviewList;
        this.editUserReview = editUserReview;
        this.deleteUserReview = deleteUserReview;
        this.getConnections = getConnections;
        this.getLocations = getLocations;
        this.saveLocation = saveLocation;
        this.updateLocation = updateLocation;
        this.removeLocation = removeLocation;
        this.getMilesFromYou = getMilesFromYou;

        function getContactInformation(userId) {
            return Restangular.one('user/profile', userId).get();
        }

        function editContactInformation(userId, contactInfo) {
            return Restangular.one('user', 'profile').customPUT(contactInfo, userId);
        }

        function getInterests(userId) {
            return Restangular.one('user', 'profile').one(userId, 'interests').get();
            //var deferred = $q.defer();
            //deferred.resolve([{name: "Interest 1"}, {name: "Interest 2"}]);
            //return deferred.promise;
        }

        function addUserReview(review) {
            return Restangular.one('user', 'review').customPOST(review);
        }

        function getReviewList(userId) {
            //user/profile/:id/reviews
            return Restangular.one('user', 'profile').one(userId, 'reviews').get();
        }

        function editUserReview(review) {
            return Restangular.one('user', 'review').customPUT(review);
        }

        function deleteUserReview(review) {
            return Restangular.one('user/review', 'delete').customPOST(review);
        }

        function getConnections(userId) {
            return Restangular.one('user', 'profile').one(userId, 'connections').get();
        }

        function getLocations() {
            // GET /user/locations
            return Restangular.one('user', 'locations').get();
        }

        function saveLocation(latitude, longitude, displayName) {
            // POST /user/locations
            return Restangular.one('user', 'locations').customPOST({
                latitude: latitude,
                longitude: longitude,
                displayName: displayName
            });
        }

        function updateLocation(locationIndex, latitude, longitude, displayName) {
            return Restangular.one('user', 'locations').customPUT({
                latitude: latitude,
                longitude: longitude,
                displayName: displayName
            }, locationIndex);
        }

        function removeLocation(locationIndex) {
            return Restangular.one('user', 'locations').customDELETE(locationIndex);
        }

        function getMilesFromYou(userId) {
            return Restangular.one('user/distance', userId).get();
        }

    }

})();