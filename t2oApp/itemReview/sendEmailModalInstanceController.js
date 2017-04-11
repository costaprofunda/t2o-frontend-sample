/**
 * Created by cpro on 17.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('SendEmailModalInstanceController', SendEmailModalInstanceController);

    SendEmailModalInstanceController.$inject = ['$uibModalInstance', '$filter', 'EmailService', 'Utils', 'planId', 'planImageUrl', 'productName'];

    function SendEmailModalInstanceController($uibModalInstance, $filter, EmailService, Utils, planId, planImageUrl, productName) {
        var vmSendEmail = this;

        vmSendEmail.planImageUrl = planImageUrl;
        vmSendEmail.subject = productName;
        vmSendEmail.recipients = [];

        vmSendEmail.cancel = cancel;
        vmSendEmail.send = send;

        EmailService.getTemplateByPlanId(planId).then(function (text) {
            vmSendEmail.message = text;
        });

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function send() {
            vmSendEmail.errors = {
                recipients: [],
                subject: [],
                message: []
            };
            var isValid = true;
            if (!vmSendEmail.recipients.length) {
                vmSendEmail.errors.recipients.push("Email address hasn't been entered");
                isValid = false;
            }
            if (!vmSendEmail.subject) {
                vmSendEmail.errors.subject.push("Subject hasn't been entered");
                isValid = false;
            }
            if (!vmSendEmail.message) {
                vmSendEmail.errors.message.push("No message text");
                isValid = false;
            }
            if (!isValid) return;
            vmSendEmail.recipients = Utils.unTagArray(vmSendEmail.recipients);
            //vmSendEmail.message = $filter('linky')(vmSendEmail.message);
            EmailService.sendEmail(planId, vmSendEmail.recipients, vmSendEmail.subject, vmSendEmail.message).then(function () {
                $uibModalInstance.close();
            });
        }
    }

})();