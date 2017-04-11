/**
 * Created by cpro on 17.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .service('EmailService', EmailService);

    EmailService.$inject = ['Restangular'];

    function EmailService(Restangular) {

        this.getTemplateByPlanId = getTemplateByPlanId;
        this.sendEmail = sendEmail;

        function getTemplateByPlanId(planId) {
            return Restangular.one('invite-text').customPOST({planId: planId});
        }

        function sendEmail(planId, recipients, subject, message) {
            return Restangular.one('invite').customPOST({
                planId: planId,
                recipients: recipients,
                subject: subject,
                message: message
            });
        }

    }

})();