/**
 * Created by cpro on 08.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendNewItem')
        .controller('NewItemController', NewItemController);

    NewItemController.$inject = ['$rootScope', '$scope', '$state', '$timeout', '$uibModal', 'ScrollTo', 'growl', 'Messages', 'Params', 'Sizes', 'Events', 'Utils', 'ImageService', 'NewItemService'];

    function NewItemController($rootScope, $scope, $state, $timeout, $uibModal, ScrollTo, growl, Messages, Params, Sizes, Events, Utils, ImageService, NewItemService) {
        var vmNewItem = this;

        vmNewItem.item = {
            //step 0
            url: '',
            brandName: '',
            productName: '',
            allInclusivePrice: '',
            description: '',
            features: '',
            categoryId: '',
            images: [],
            //step 1
            vendorName: '',
            vendorUrl: '',
            contactName: '',
            phone: '',
            email: '',
            goodDeal: '',
            //step 2
            shares: 2,
            everybodyForAgree: false,
            numberToAgree: 2,
            authorShares: 1,
            expiration: null,
            message: '',
            //other
            planId: null,
            items: []
        };

        var number = 0;

        if (!!$state.params.item) {
            angular.extend(vmNewItem.item, $state.params.item);
            initImageContainer();
        }
        else {
            NewItemService.getPlanId().then(function (id) {
                vmNewItem.item.planId = id;
                vmNewItem.images = [];
            });
        }


        vmNewItem.categoryList = $scope.vmMain.categoryList;
        if (!vmNewItem.categoryList.length) {
            var unregisterCategoryList = $scope.$watchCollection('vmMain.categoryList', function (newVal, oldVal) {
                if (!angular.equals(newVal, oldVal) && !!newVal.length) {
                    unregisterCategoryList();
                }
            });
        }

        initErrors();

        vmNewItem.stepNames = ['Item', 'Seller', 'Team', 'Publish'];
        vmNewItem.step = 0;

        vmNewItem.onImageClick = onImageClick;

        vmNewItem.setStep = setStep;
        vmNewItem.decStep = decStep;
        vmNewItem.incStep = incStep;

        vmNewItem.canUrlBeParsed = canUrlBeParsed;
        vmNewItem.scrapeInfo = scrapeInfo;

        var minBuyDate = moment();
        minBuyDate.add(5, 'days');
        vmNewItem.minBuyDate = minBuyDate.toDate();
        vmNewItem.minNumberToAgree = parseInt(vmNewItem.item.shares / 2) + 1;

        $scope.$watch('vmNewItem.item.shares', function (newVal, oldVal) {
            if (!!newVal && !angular.equals(newVal, oldVal) && angular.isNumber(newVal)) {
                vmNewItem.minNumberToAgree = parseInt(newVal / 2) + 1;
                if (newVal < vmNewItem.item.numberToAgree) {
                    vmNewItem.minNumberToAgree = newVal;
                    vmNewItem.item.numberToAgree = newVal;
                }
                if ((newVal - 1) < vmNewItem.item.authorShares) {
                    vmNewItem.item.authorShares = newVal - 1;
                }
                if (vmNewItem.item.numberToAgree < vmNewItem.minNumberToAgree) {
                    vmNewItem.item.numberToAgree = vmNewItem.minNumberToAgree;
                }
            }
        });

        function initImageContainer() {
            vmNewItem.images = [];
            vmNewItem.item.images.forEach(function (num) {
                number++;
                vmNewItem.images.push({
                    number: num,
                    url: ImageService.getPlanImageById(vmNewItem.item.planId, num, Sizes.small)
                });
            });
        }

        function onChangeStep() {
            $timeout(function () {
                ScrollTo.idOrName('step-marker');
            }, 100);
        }

        function initErrors() {
            vmNewItem.errors = {};
            angular.forEach(vmNewItem.item, function (value, key) {
                vmNewItem.errors[key] = [];
            });
        }

        function setStep(step) {
            if ((step > vmNewItem.step)
                && !NewItemService.isStepValid(vmNewItem.step, vmNewItem.item, vmNewItem.errors, vmNewItem.images)) {
                return;
            }
            vmNewItem.step = step;
            onChangeStep();
        }

        function decStep() {
            vmNewItem.step--;
            onChangeStep();
        }

        function incStep() {

            function goForward() {
                initErrors();
                vmNewItem.step++;
                onChangeStep();
            }

            initErrors();

            if (!NewItemService.isStepValid(vmNewItem.step, vmNewItem.item, vmNewItem.errors, vmNewItem.images)) {
                return;
            }

            if ((vmNewItem.step + 1) == (vmNewItem.stepNames.length - 1)) {
                NewItemService.postPlan(NewItemService.getPlanTO(vmNewItem.item, vmNewItem.images)).then(function () {
                    growl.addSuccessMessage(Messages.planSaved);
                    $rootScope.$emit(Events.planAdded, vmNewItem.item.categoryId);
                    $state.go('home.itemReview', {id: vmNewItem.item.planId});
                }, function (error) {
                    console.log("error: ", error);
                });
            }
            else {
                goForward();
            }

        }

        function canUrlBeParsed() {
            if (Utils.isStringUrl(vmNewItem.item.url)) {
                for (var i = 0; i < Params.parsedSites.length; i++) {
                    if (vmNewItem.item.url.indexOf(Params.parsedSites[i]) > 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        function scrapeInfo() {
            NewItemService.scrapePlan(vmNewItem.item.url).then(function (scrapedInfo) {
                angular.extend(vmNewItem.item, scrapedInfo);
                initImageContainer();
                if (!!vmNewItem.item.allInclusivePrice) {
                    vmNewItem.item.allInclusivePrice = '$' + vmNewItem.item.allInclusivePrice;
                }
                else {
                    vmNewItem.item.allInclusivePrice = '';
                }
            });
        }

        function onImageClick(image) {
            $uibModal.open({
                templateUrl: 'core/planImageModal.html',
                controller: 'PlanImageModalInstanceController',
                controllerAs: 'vmPlanImage',
                resolve: {
                    planId: function () {
                        return vmNewItem.item.planId;
                    },
                    number: function () {
                        return (!image) ? (number + 1) : image.number;
                    },
                    edit: function () {
                        return !!image;
                    }
                },
                backdrop: 'static'
            }).result.then(function (removed) {
                if (!!removed) {
                    var imageIndex = vmNewItem.images.indexOf(image);
                    vmNewItem.images.splice(imageIndex, 1);
                    return;
                }
                if (!image) {
                    number++;
                    vmNewItem.images.push({
                        number: number,
                        url: ImageService.getPlanImageById(vmNewItem.item.planId, number, Sizes.small, true)
                    });
                }
                else {
                    image.url = ImageService.getPlanImageById(vmNewItem.item.planId, image.number, Sizes.small, true);
                }
            });
        }

    }

})();