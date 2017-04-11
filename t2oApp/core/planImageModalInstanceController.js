/**
 * Created by cpro on 10.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .controller('PlanImageModalInstanceController', PlanImageModalInstanceController);

    PlanImageModalInstanceController.$inject = ['$scope', '$timeout', '$uibModalInstance', 'FileUploader', 'Sizes', 'Utils', 'ImageService', 'planId', 'number', 'edit'];

    function PlanImageModalInstanceController($scope, $timeout, $uibModalInstance, FileUploader, Sizes, Utils, ImageService, planId, number, edit) {
        var vmPlanImage = this;

        var image;

        vmPlanImage.pictureUrl = '';
        vmPlanImage.edit = edit;

        vmPlanImage.cancel = cancel;
        vmPlanImage.crop = crop;
        vmPlanImage.remove = remove;
        vmPlanImage.onDeleteImage = onDeleteImage;
        vmPlanImage.zoomImage = zoomImage;
        vmPlanImage.moveImage = moveImage;

        vmPlanImage.uploader = new FileUploader({
            url: ImageService.getUploadImageUrl(planId, number),
            withCredentials: true
        });
        vmPlanImage.uploader.onAfterAddingFile = onAfterAddingFile;
        vmPlanImage.uploader.onCompleteItem = onCompleteItem;
        vmPlanImage.uploader.onErrorItem = onFileUploadError;

        initImage();

        if (!!edit) {
            $timeout(function () {
                showCropper();
            }, 2000);
        }

        $scope.$watch('vmPlanImage.pictureUrl', function (newVal, oldVal) {
            if (!!newVal && !angular.equals(newVal, oldVal) && Utils.isStringUrl(newVal)) {
                onPictureUrlChange();
            }
        });

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function crop() {
            image.cropper('getCroppedCanvas', {fillColor: '#fff'}).toBlob(function (blob) {
                ImageService.cropPlanImage(blob, planId, number).then(function () {
                    console.log("cropped image has been saved");
                    $uibModalInstance.close();
                }, function () {
                    vmPlanImage.invalidPictureMessage = "image can not be cropped";
                });
            });
        }

        function remove() {
            $uibModalInstance.close(true);
        }

        function initImage() {
            vmPlanImage.uploadedImageUrl = null;
            vmPlanImage.uploading = false;
            vmPlanImage.cropArea = null;
            vmPlanImage.invalidPictureMessage = "";
        }

        function onAfterAddingFile(fileItem) {
            vmPlanImage.invalidPictureMessage = "";
            while (vmPlanImage.uploader.queue.length > 1) {
                vmPlanImage.uploader.queue.shift();
            }
            fileItem.upload();
            vmPlanImage.uploading = true;
        }

        function onCompleteItem() {
            if (!vmPlanImage.invalidPictureMessage) {
                showCropper();
            }
        }

        function onFileUploadError() {
            vmPlanImage.invalidPictureMessage = "File cannot be uploaded";
        }

        function onDeleteImage() {
            vmPlanImage.pictureUrl = '';
            initImage();
        }

        function zoomImage(value) {
            image.cropper('zoom', value);
        }

        function moveImage(valueX, valueY) {
            image.cropper('move', valueX, valueY);
        }

        function onPictureUrlChange() {
            Utils.isImageSourceValid(vmPlanImage.pictureUrl).then(function () {
                ImageService.loadExternalImage(vmPlanImage.pictureUrl, planId, number).then(showCropper, function () {
                    vmPlanImage.invalidPictureMessage = "Invalid image source";
                });
            }, function () {
                vmPlanImage.invalidPictureMessage = "Invalid image source";
            });
        }

        function showCropper() {
            vmPlanImage.uploadedImageUrl = ImageService.getPlanImageById(planId, number, Sizes.origin, true);
            vmPlanImage.invalidPictureMessage = "";
            $timeout(function () {
                image = angular.element('#plan-image');
                var cropperOptions = {
                    aspectRatio: 4 / 3,
                    minCropBoxWidth: 100
                };
                image.cropper(cropperOptions);
                //Zoom until fit
                $timeout(function () {
                    var imageData = image.cropper('getImageData');
                    var cropBoxData = image.cropper('getCropBoxData');
                    if (imageData.naturalHeight >= imageData.naturalWidth) {
                        while (imageData.height > cropBoxData.height) {
                            image.cropper('zoom', -0.05);
                            imageData = image.cropper('getImageData');
                        }
                    }
                    else {
                        while (imageData.width > cropBoxData.width) {
                            image.cropper('zoom', -0.05);
                            imageData = image.cropper('getImageData');
                        }
                    }
                }, 2000);
            });
        }
    }

})();