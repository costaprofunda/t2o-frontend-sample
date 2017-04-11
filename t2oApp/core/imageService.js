/**
 * Created by cpro on 09.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .factory('ImageService', ImageService);

    ImageService.$inject = ['Restangular', 'Env', 'Sizes'];

    function ImageService(Restangular, Env, Sizes) {

        var itemImageUrl = '/item-image/%(id)s/%(number)s/%(size)s';
        var userImageUrl = '/user/profile/%(id)s/image/';
        var uploadImageUrl = '/item-image/%(id)s/%(number)s';
        var loadExternalImageUrl = 'item-image-external/%(id)s/%(number)s';
        var cropImageUrl = 'item-image-crop/%(id)s/%(number)s';

        var service = {
            getPlanImageById: getPlanImageById,
            getUserImageById: getUserImageById,
            getUploadImageUrl: getUploadImageUrl,
            loadExternalImage: loadExternalImage,
            cropPlanImage: cropPlanImage,
            removeImage: removeImage
        };

        function getPlanImageById(id, number, size, randomize) {
            return Env.apiUrl + sprintf(itemImageUrl, {id: id, number: number, size: size}) + (!randomize ? '' : ('?c=' + Math.random()));
        }

        function getUserImageById(userId, large, enableCache) {
            return Env.apiUrl + sprintf(userImageUrl + (!large ? Sizes.small : Sizes.large) + (!enableCache ? ('?c=' + Math.random()) : ''), {id: userId});
        }

        function getUploadImageUrl(planId, number) {
            return Env.apiUrl + sprintf(uploadImageUrl, {id: planId, number: number});
        }

        function loadExternalImage(url, planId, number) {
            return Restangular.one(sprintf(loadExternalImageUrl, {id: planId, number: number})).customPOST({url: url});
        }

        function cropPlanImage(blob, planId, number) {
            var formData = new FormData();
            formData.append('file', blob, "blob.png");
            return Restangular.one(sprintf(cropImageUrl, {id: planId, number: number})).withHttpConfig({transformRequest: angular.identity}).customPOST(formData, '', undefined, {'Content-Type': undefined});
        }

        function removeImage(planId, number) {
            return Restangular.one(sprintf(uploadImageUrl, {id: planId, number: number})).customDELETE();
        }

        return service;

    }

})();