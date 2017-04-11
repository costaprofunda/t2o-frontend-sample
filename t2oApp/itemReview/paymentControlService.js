/**
 * Created by cpro on 08.12.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .service('PaymentControlService', PaymentControlService);

    PaymentControlService.$inject = ['Restangular'];

    function PaymentControlService(Restangular) {

        this.markUserAsPaid = markUserAsPaid;
        this.getTreasurerInfo = getTreasurerInfo;

        function markUserAsPaid(paymentInfo) {
            return Restangular.one('mark-user-as-paid').customPOST(paymentInfo);
        }

        function getTreasurerInfo(userId, planId) {
            return Restangular.one('treasurer-info').customGET('', {userId: userId, planId: planId});
        }

    }

})();