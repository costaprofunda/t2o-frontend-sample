/**
 * Created by cpro on 09.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendNewItem')
        .service('NewItemService', NewItemService);

    NewItemService.$inject = ['Restangular'];

    function NewItemService(Restangular) {

        this.postPlan = postPlan;
        this.isStepValid = isStepValid;
        this.getPlanTO = getPlanTO;
        this.scrapePlan = scrapePlan;
        this.getPlanId = getPlanId;

        function postPlan(plan) {
            return Restangular.one('plan').customPOST(plan);
        }

        function isStepValid(step, item, errors, images) {
            var valid = true;
            if (!item.productName) {
                valid = false;
                errors.productName.push("Field must be filled");
            }
            if (!item.allInclusivePrice) {
                valid = false;
                errors.allInclusivePrice.push("Field must be filled");
            }
            if (!item.categoryId) {
                valid = false;
                errors.categoryId.push("Value must be selected");
            }
            if (!images.length) {
                errors.images.push("At least one image must be uploaded");
                valid = false;
            }
            if (step == 1) {
                if (!item.vendorName) {
                    errors.vendorName.push("Field must be filled");
                    valid = false;
                }
                if (angular.isUndefined(item.email)) {
                    errors.email.push("Invalid email address");
                    valid = false;
                }
            }
            if (step == 2) {
                if (!item.shares || item.shares < 2) {
                    valid = false;
                    errors.shares.push("Field must be filled");
                }
                if (!item.everybodyForAgree && (!item.numberToAgree || item.numberToAgree < 2)) {
                    valid = false;
                    errors.numberToAgree.push("Field must be filled");
                }
                if (!item.authorShares) {
                    valid = false;
                    errors.authorShares.push("Value must be selected");
                }
                if (!item.expiration) {
                    errors.expiration.push("Date must be selected");
                    valid = false;
                }
            }
            return valid;
        }

        function getPlanTO(item, images) {
            var to = angular.copy(item);
            to.images = [];
            images.forEach(function (image) {
                to.images.push(image.number);
            });
            var expirationDate = moment(to.expiration);
            expirationDate.add(1, 'days');
            to.expiration = expirationDate.toDate();
            to.numberToAgree = to.everybodyForAgree ? to.shares : to.numberToAgree;
            if (!angular.isNumber(to.allInclusivePrice)) {
                to.allInclusivePrice = parseFloat(to.allInclusivePrice.replace(/[^\d.]/g, ''));
            }
            return to;
        }

        function scrapePlan(url) {
            return Restangular.one('plan-scrape-url').customPOST({url: url});
        }

        function getPlanId() {
            return Restangular.one('plan-id').customGET();
        }

    }

})();