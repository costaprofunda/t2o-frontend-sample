/**
 * Created by cpro on 13.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .service('ItemReviewService', ItemReviewService);

    ItemReviewService.$inject = ['Restangular'];

    function ItemReviewService(Restangular) {

        this.getPlanById = getPlanById;
        this.updatePlanInfoById = updatePlanInfoById;
        this.getPlanInfo = getPlanInfo;
        this.sendJoinRequest = sendJoinRequest;
        this.sendIncreaseStakeRequest = sendIncreaseStakeRequest;
        this.exitPlan = exitPlan;
        this.copyPlan = copyPlan;
        this.getPlanItemGroupTypeList = getPlanItemGroupTypeList;
        this.getQuestionListByCategory = getQuestionListByCategory;
        this.savePlanItemGroup = savePlanItemGroup;
        this.savePlanItem = savePlanItem;
        this.editPlanItem = editPlanItem;
        this.getPlanItemGroupTO = getPlanItemGroupTO;
        this.saveQuestion = saveQuestion;
        this.addRejection = addRejection;
        this.sendTreasurerRequest = sendTreasurerRequest;
        this.voteForPlanContinue = voteForPlanContinue;
        this.unVoteForPlanContinue = unVoteForPlanContinue;
        this.voteForPlanFinish = voteForPlanFinish;
        this.unVoteForPlanFinish = unVoteForPlanFinish;
        this.voteForPlanObject = voteForPlanObject;
        this.unVoteForPlanObject = unVoteForPlanObject;

        function getPlanById(id) {
            return Restangular.one('plan', id).get();
        }

        function updatePlanInfoById(id, info) {
            return Restangular.one('plan', id).customPUT(info);
        }

        function getPlanInfo(plan) {
            var planInfo = {};
            planInfo.title = plan.title;
            planInfo.brandName = plan.brandName;
            planInfo.description = plan.description;
            planInfo.features = plan.features;
            planInfo.url = plan.url;
            planInfo.message = plan.message;
            planInfo.categoryId = plan.categoryId;
            return planInfo;
        }

        function sendJoinRequest(request) {
            return Restangular.one('join-request').customPOST(request);
        }

        function sendIncreaseStakeRequest(request) {
            return Restangular.one('increase-stake-request').customPOST(request);
        }

        function exitPlan(planId) {
            return Restangular.one('plan-exit').customPOST({planId: planId});
        }

        function copyPlan(planId) {
            return Restangular.one('plan-copy').customPOST({planId: planId});
        }

        function getPlanItemGroupTypeList() {
            return Restangular.all('plan-item-group-type ').getList();
        }

        function getQuestionListByCategory(categoryId) {
            return Restangular.one('question').get({categoryId: categoryId});
        }

        function savePlanItemGroup(planItemGroup) {
            return Restangular.one('plan-item-group').customPOST(planItemGroup);
        }

        function savePlanItem(planItemGroupObjId, planItem) {
            var newPlanItemTO = {
                objId: planItemGroupObjId,
                item: planItem
            };
            return Restangular.one('plan-item').customPOST(newPlanItemTO);
        }

        function editPlanItem(planItem) {
            return Restangular.one('plan-item').customPUT({item: planItem});
        }

        function getPlanItemGroupTO(planItemGroup) {
            var to = angular.copy(planItemGroup);
            delete to.type;
            if (!!to.question && !!to.question.id) {
                to.questionId = to.question.id;
                delete to.question;
            }
            return to;
        }

        function saveQuestion(question) {
            return Restangular.one('question').customPOST(question);
        }

        function addRejection(rejectionInfo) {
            return Restangular.one('scrap-plan-item').customPOST(rejectionInfo);
        }

        function sendTreasurerRequest(request) {
            return Restangular.one('treasurer-request').customPOST(request);
        }

        function voteForPlanContinue(voteInfo) {
            return Restangular.one('vote-plan-continue').customPOST(voteInfo);
        }

        function unVoteForPlanContinue(unVoteInfo) {
            return Restangular.one('unvote-plan-continue').customPOST(unVoteInfo);
        }

        function voteForPlanFinish(voteInfo) {
            return Restangular.one('vote-plan-finish').customPOST(voteInfo);
        }

        function unVoteForPlanFinish(unVoteInfo) {
            return Restangular.one('unvote-plan-finish').customPOST(unVoteInfo);
        }

        function voteForPlanObject(objId) {
            return Restangular.one('vote-plan-object').customPOST({objId: objId});
        }

        function unVoteForPlanObject(objId) {
            return Restangular.one('unvote-plan-object').customPOST({objId: objId});
        }

    }

})();