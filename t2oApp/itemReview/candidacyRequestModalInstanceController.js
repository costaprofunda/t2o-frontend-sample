/**
 * Created by cpro on 27.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('CandidacyRequestModalInstanceController', CandidacyRequestModalInstanceController);

    CandidacyRequestModalInstanceController.$inject = ['$uibModalInstance', 'candidacyList'];

    function CandidacyRequestModalInstanceController($uibModalInstance, candidacyLList) {
        var vmCandidacyRequest = this;

        candidacyLList.forEach(function (candidate) {
            candidate.id = candidate.userId;
        });
        vmCandidacyRequest.candidacyList = candidacyLList;

        vmCandidacyRequest.request = {
            userId: null,
            message: ''
        };

        vmCandidacyRequest.cancel = cancel;
        vmCandidacyRequest.send = send;

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function send() {
            vmCandidacyRequest.errors = {
                userId: []
            };
            var valid = true;
            if (!vmCandidacyRequest.request.userId) {
                valid = false;
                vmCandidacyRequest.errors.userId.push("You need to choose a candidate from the list");
            }
            if (!valid) return;
            $uibModalInstance.close(vmCandidacyRequest.request);
        }
    }

})();