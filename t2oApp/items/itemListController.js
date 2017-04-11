/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItems')
        .controller('ItemListController', ItemListController);

    ItemListController.$inject = ['$scope', '$state', '$stateParams', '$uibModal', '$filter', '$timeout', 'growl', 'Sizes', 'States', 'Messages', 'Events', 'Utils', 'ImageService', 'ItemListService', 'SocialSharingService'];

    function ItemListController($scope, $state, $stateParams, $uibModal, $filter, $timeout, growl, Sizes, States, Messages, Events, Utils, ImageService, ItemListService, SocialSharingService) {
        var vmItemList = this;

        var categoryList = [];
        vmItemList.itemsLoaded = false;
        vmItemList.planList = [];
        vmItemList.categoryName = {parent: '', child: ''};
        vmItemList.mine = false;
        vmItemList.showNoItemsMessage = false;
        vmItemList.searchKeyword = $stateParams.searchKeyword;
        vmItemList.pager = {
            currentPage: 1,
            totalCount: 0,
            pageSize: 5,
            maxSize: 5
        };
        vmItemList.pageSizeList = [5, 10, 20, 50];
        vmItemList.authorized = $scope.vmMain.isAuthorized;
        if (angular.isUndefined(vmItemList.authorized)) {
            var unregister = $scope.$watch('vmMain.isAuthorized', function (newVal) {
                if (angular.isDefined(newVal)) {
                    vmItemList.authorized = newVal;
                    unregister();
                }
            });
        }

        vmItemList.getPlansByParticipation = getPlansByParticipation;
        vmItemList.publishToFacebook = publishToFacebook;
        vmItemList.onSendEmailClick = onSendEmailClick;
        vmItemList.pageChanged = pageChanged;

        $scope.$watch('vmItemList.pager.pageSize', function (newVal, oldVal) {
            if (!!newVal && (newVal !== oldVal)) {
                loadPlans();
            }
        });

        $scope.$on(Events.locationUpdated, loadPlans);
        $scope.$on(Events.logout, function () {
            vmItemList.authorized = false;
            loadPlans();
        });

        function processItems() {
            vmItemList.planList.forEach(function (item, index) {
                item.openShares = item.totalShares - item.joinedShares;
                item.pricePerShare = (item.price / item.totalShares).toFixed(2);
                item.planImageUrl = ImageService.getPlanImageById(item.id, 1, Sizes.medium);

                item.daysToGo = Utils.getDaysUntilNow(item.expiration);
                if ((item.daysToGo < 0) || (item.state === States.readyToBuy) || (item.state === States.closed)) {
                    item.daysToGo = 0;
                }
                $timeout(function () {
                    var planInfo = angular.element('#plan-info-' + index);
                    var planMainInfo = angular.element('#plan-main-info-' + index);
                    var planAdditionalInfo = angular.element('#plan-additional-info-' + index);
                    planAdditionalInfo.css('height', planInfo.height() - planMainInfo.height());
                });
            });
            vmItemList.itemsLoaded = true;
        }

        function initCategoryName() {
            var selectedCategory = $filter('property')(categoryList, 'id', $stateParams.categoryId)[0];
            vmItemList.categoryName.child = selectedCategory.name;
            vmItemList.categoryName.parent = selectedCategory.group;
        }

        function loadPlans() {
            vmItemList.showNoItemsMessage = false;
            ItemListService.getItemList(vmItemList.mine, $stateParams.categoryId, vmItemList.searchKeyword, vmItemList.pager.currentPage, vmItemList.pager.pageSize).then(function (result) {
                vmItemList.pager.totalCount = result.total;
                vmItemList.planList = result.items;
                if (!vmItemList.planList.length) {
                    vmItemList.showNoItemsMessage = true;
                }
                processItems();
                if (!!$stateParams.categoryId) {
                    categoryList = $scope.vmMain.categoryList;
                    if (!categoryList.length) {
                        var unregisterCategoryList = $scope.$watchCollection('vmMain.categoryList', function (newVal, oldVal) {
                            if (!angular.equals(newVal, oldVal) && !!newVal.length) {
                                unregisterCategoryList();
                                initCategoryName();
                            }
                        });
                    }
                    else {
                        initCategoryName();
                    }
                }
            });
        }

        function getPlansByParticipation(mine) {
            vmItemList.mine = mine;
            loadPlans();
        }

        function publishToFacebook(item) {
            //var planUrl = 'http://t2o.intricity.com/' + $state.href('home.itemReview', {id: item.id});
            var planUrl = $state.href('home.itemReview', {id: item.id}, {absolute: true});
            SocialSharingService.sharePlanOnFacebook(planUrl, item.title, item.planImageUrl, item.pricePerShare, item.openShares, item.teamMember);
        }

        function onSendEmailClick(item) {
            $uibModal.open({
                templateUrl: 'itemReview/sendEmailModal.html',
                controller: 'SendEmailModalInstanceController',
                controllerAs: 'vmSendEmail',
                resolve: {
                    planId: function () {
                        return item.id;
                    },
                    planImageUrl: function () {
                        return ImageService.getPlanImageById(item.id, 1, Sizes.large);
                    },
                    productName: function () {
                        return item.title;
                    }
                },
                backdrop: 'static'
            }).result.then(function () {
                growl.addSuccessMessage(Messages.mailSent);
            });
        }

        function pageChanged() {
            loadPlans();
        }
    }

})();