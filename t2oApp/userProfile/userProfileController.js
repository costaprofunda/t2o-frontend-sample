/**
 * Created by cpro on 24.01.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendUserProfile')
        .controller('UserProfileController', UserProfileController);

    UserProfileController.$inject = ['$scope', '$uibModal', '$filter', 'growl', 'ScrollTo', 'Params', 'Messages', 'UserProfileService', 'contactInfo'];

    function UserProfileController($scope, $uibModal, $filter, growl, ScrollTo, Params, Messages, UserProfileService, contactInfo) {
        var vmUserProfile = this;

        vmUserProfile.contactInfo = contactInfo;
        vmUserProfile.newContactInfo = {};
        vmUserProfile.maxStars = Params.userRatingMaxStars;
        vmUserProfile.connections = [];
        vmUserProfile.locations = [];
        vmUserProfile.distanceFromYou = null;
        vmUserProfile.rating = 0;
        vmUserProfile.usersConnected = false;

        vmUserProfile.onContactInfoEditClick = onContactInfoEditClick;
        vmUserProfile.onChangePasswordClick = onChangePasswordClick;
        vmUserProfile.postReview = postReview;
        vmUserProfile.hoveringOverRating = hoveringOverRating;
        vmUserProfile.isReviewReadyToBePosted = isReviewReadyToBePosted;
        vmUserProfile.deleteReview = deleteReview;
        vmUserProfile.onEditReviewClick = onEditReviewClick;
        vmUserProfile.onCancelReview = onCancelReview;
        vmUserProfile.saveOrUpdateLocation = saveOrUpdateLocation;
        vmUserProfile.removeLocation = removeLocation;

        vmUserProfile.userInfo = $scope.vmMain.userInfo;
        if (!vmUserProfile.userInfo) {
            var unregisteredUserInfo = $scope.$watch('vmMain.userInfo', function (newVal, oldVal) {
                if (!!newVal && !angular.equals(newVal, oldVal)) {
                    vmUserProfile.userInfo = newVal;
                    unregisteredUserInfo();
                    initUserProfile();
                }
            });
        }
        else {
            initUserProfile();
        }

        function initNewReview() {
            vmUserProfile.overStar = null;
            vmUserProfile.userRating = null;
            vmUserProfile.newReview = {
                userId: contactInfo.id,
                message: '',
                percent: null
            };
        }

        function initUserProfile() {
            UserProfileService.getInterests(vmUserProfile.contactInfo.id).then(function (interests) {
                vmUserProfile.interests = interests;
            });

            UserProfileService.getConnections(vmUserProfile.contactInfo.id).then(function (connections) {
                vmUserProfile.connections = connections;
                vmUserProfile.connections.forEach(function (connection) {
                   if (connection.id === vmUserProfile.userInfo.id) {
                        vmUserProfile.usersConnected = true;
                   }
                });
                UserProfileService.getReviewList(vmUserProfile.contactInfo.id).then(function (reviews) {
                    vmUserProfile.reviews = reviews;
                    vmUserProfile.postedReview = !!($filter('property')(vmUserProfile.reviews, 'author.id', vmUserProfile.userInfo.id)).length;
                    countUserRating();
                });
            });

            if (vmUserProfile.contactInfo.id !== vmUserProfile.userInfo.id) {
                UserProfileService.getMilesFromYou(vmUserProfile.contactInfo.id).then(function (miles) {
                    vmUserProfile.distanceFromYou = miles;
                });
            }
            else {
                UserProfileService.getLocations().then(function (locations) {
                    vmUserProfile.locations = locations;
                });
            }

            initNewReview();
        }

        function countUserRating() {
            var totalRating = 0;
            vmUserProfile.reviews.forEach(function (review) {
                totalRating += review.percent;
                console.log("review: ", review);
            });
            if (!!vmUserProfile.reviews.length) {
                vmUserProfile.rating = (totalRating / vmUserProfile.reviews.length).toFixed(0);
            }
        }

        function onContactInfoEditClick() {
            $uibModal.open({
                templateUrl: 'userProfile/contactInfoModal.html',
                controller: 'ContactInfoModalInstanceController',
                controllerAs: 'vmContactInfo',
                resolve: {
                    info: function () {
                        return angular.copy(vmUserProfile.contactInfo);
                    }
                },
                backdrop: 'static'
            }).result.then(function (newContactInfo) {
                if (!angular.equals(vmUserProfile.contactInfo, newContactInfo)) {
                    UserProfileService.editContactInformation(vmUserProfile.contactInfo.id, newContactInfo).then(function () {
                        angular.extend(vmUserProfile.contactInfo, newContactInfo);
                        for (var field in vmUserProfile.userInfo) {
                            if (!angular.isUndefined(vmUserProfile.userInfo[field]) && !angular.isUndefined(vmUserProfile.contactInfo[field])) {
                                vmUserProfile.userInfo[field] = vmUserProfile.contactInfo[field];
                            }
                        }
                        growl.addSuccessMessage(Messages.userInfoSaved);
                    });
                }
            });
        }

        function onChangePasswordClick() {
            $uibModal.open({
                templateUrl: 'userProfile/changePasswordModal.html',
                controller: 'ChangePasswordModalInstanceController',
                controllerAs: 'vmChangePassword',
                resolve: {
                    userInfo: function () {
                        return vmUserProfile.userInfo;
                    }
                }
            }).result.then(function () {
                growl.addSuccessMessage(Messages.passwordSaved);
                vmUserProfile.userInfo.blankPassword = false;
            });
        }

        function postReview() {
            vmUserProfile.newReview.percent = 100 * (vmUserProfile.userRating / vmUserProfile.maxStars);
            if (!vmUserProfile.newReview.reviewId) {
                UserProfileService.addUserReview(vmUserProfile.newReview).then(function (reviewId) {
                    growl.addSuccessMessage(Messages.reviewSaved);
                    var postedReview = {
                        reviewId: reviewId,
                        percent: vmUserProfile.newReview.percent,
                        message: vmUserProfile.newReview.message,
                        createdAt: new Date(),
                        updateAt: new Date(),
                        author: {
                            id: vmUserProfile.userInfo.id,
                            firstName: vmUserProfile.userInfo.firstName,
                            lastName: vmUserProfile.userInfo.lastName
                        }
                    };
                    vmUserProfile.reviews.push(postedReview);
                    vmUserProfile.postedReview = true;
                    countUserRating();
                });
            }
            else {
                var updatedReview = $filter('property')(vmUserProfile.reviews, 'reviewId', vmUserProfile.newReview.reviewId)[0];
                if ((updatedReview.percent !== vmUserProfile.newReview.percent)
                    || (updatedReview.message !== vmUserProfile.newReview.message)) {
                    UserProfileService.editUserReview(vmUserProfile.newReview).then(function () {
                        growl.addSuccessMessage(Messages.reviewUpdated);
                        updatedReview.percent = vmUserProfile.newReview.percent;
                        updatedReview.message = vmUserProfile.newReview.message;
                        updatedReview.updateAt = new Date();
                        countUserRating();
                    });
                }
                vmUserProfile.postedReview = true;
            }
        }

        function hoveringOverRating(value) {
            vmUserProfile.overStar = value;
            vmUserProfile.percentValue = 100 * (value / vmUserProfile.maxStars);
        }

        function isReviewReadyToBePosted() {
            if (!vmUserProfile.newReview) return false;
            return (!!vmUserProfile.newReview.message && !!vmUserProfile.userRating);
        }

        function deleteReview(review) {
            review.userId = vmUserProfile.contactInfo.id;
            UserProfileService.deleteUserReview(review).then(function () {
                growl.addSuccessMessage(Messages.reviewDeleted);
                vmUserProfile.reviews.splice(vmUserProfile.reviews.indexOf(review), 1);
                vmUserProfile.postedReview = false;
                countUserRating();
                initNewReview();
            });
        }

        function onEditReviewClick(review) {
            var updatedReview = $filter('property')(vmUserProfile.reviews, 'reviewId', review.reviewId)[0];
            vmUserProfile.newReview = {
                reviewId: updatedReview.reviewId,
                userId: contactInfo.id,
                message: updatedReview.message,
                percent: updatedReview.percent
            };
            vmUserProfile.userRating = (vmUserProfile.newReview.percent * vmUserProfile.maxStars) / 100;
            vmUserProfile.postedReview = false;
            ScrollTo.idOrName('post-review-area');
        }

        function onCancelReview() {
            if (!!vmUserProfile.newReview.reviewId) {
                vmUserProfile.postedReview = true;
            }
            initNewReview();
        }

        function saveOrUpdateLocation(location) {
            $uibModal.open({
                templateUrl: 'core/locationModal.html',
                controller: 'LocationModalInstanceController',
                controllerAs: 'vmLocation',
                resolve: {
                    location: function () {
                        return location || null;
                    },
                    locationIndex: function() {
                        return (vmUserProfile.locations.indexOf(location) + 1);
                    }
                }
            }).result.then(function (savedInfo) {
                if (!location) {
                    growl.addSuccessMessage("Location saved");
                    vmUserProfile.locations.push(savedInfo);
                }
                else {
                    growl.addSuccessMessage("Location changed");
                    angular.extend(location, savedInfo);
                }
            });
        }

        function removeLocation(location) {
            var index = vmUserProfile.locations.indexOf(location);
            UserProfileService.removeLocation(index + 1).then(function () {
                growl.addSuccessMessage("Location deleted");
                vmUserProfile.locations.splice(index, 1);
            });
        }
    }

})();