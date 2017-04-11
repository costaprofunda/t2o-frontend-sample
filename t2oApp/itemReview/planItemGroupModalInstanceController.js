/**
 * Created by cpro on 11.10.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('PlanItemGroupModalInstanceController', PlanItemGroupModalInstanceController);

    PlanItemGroupModalInstanceController.$inject = ['$uibModal', '$uibModalInstance', '$filter', 'ConfirmationModalTypes', 'types', 'question', 'questions', 'planItemGroup'];

    function PlanItemGroupModalInstanceController($uibModal, $uibModalInstance, $filter, ConfirmationModalTypes, types, question, questions, planItemGroup) {
        var vmPlanItemGroup = this;

        if (!planItemGroup) {
            vmPlanItemGroup.planItemGroup = {
                question: question || {id: null, title: ''},
                type: null,
                item: {
                    url: '',
                    name: '',
                    price: '',
                    reoccurringPrice: false,
                    provider: '',
                    description: '',
                    goodDeal: '',
                    contactName: '',
                    phone: '',
                    email: ''
                }
            };
        }
        else {
            vmPlanItemGroup.planItemGroup = planItemGroup;
            vmPlanItemGroup.planItemGroup.item = {
                url: '',
                name: '',
                price: '',
                reoccurringPrice: false,
                provider: '',
                description: '',
                goodDeal: '',
                contactName: '',
                phone: '',
                email: ''
            };
        }
        vmPlanItemGroup.types = types;
        vmPlanItemGroup.questions = questions;

        if (!!vmPlanItemGroup.planItemGroup.question.id) {
            vmPlanItemGroup.planItemGroup.type = $filter('property')(types, 'id', vmPlanItemGroup.planItemGroup.question.planItemGroupTypeId)[0];
        }

        vmPlanItemGroup.onQuestionSelect = onQuestionSelect;
        vmPlanItemGroup.cancel = cancel;
        vmPlanItemGroup.save = save;
        vmPlanItemGroup.saveWithoutAnswer = save;

        function onQuestionSelect() {
            vmPlanItemGroup.planItemGroup.question = vmPlanItemGroup.planItemGroup.question.title;
            vmPlanItemGroup.planItemGroup.type = $filter('property')(types, 'id', vmPlanItemGroup.planItemGroup.question.planItemGroupTypeId)[0];
        }

        function isPlanItemGroupValid(planItemGroup, errors) {
            var valid = true;
            if (!planItemGroup.type) {
                errors.type.push('Type has to be chosen');
                valid = false;
            }
            if (!planItemGroup.question.title) {
                errors.question.push('Question has to be selected');
                valid = false;
            }
            return valid;
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        function save(withoutAnswer) {
            vmPlanItemGroup.errors = {
                question: [],
                type: []
            };
            if (!isPlanItemGroupValid(vmPlanItemGroup.planItemGroup, vmPlanItemGroup.errors)) return;
            if (!withoutAnswer) {
                if (!!vmPlanItemGroup.planItemGroup.item.price && !angular.isNumber(vmPlanItemGroup.planItemGroup.item.price)) {
                    vmPlanItemGroup.planItemGroup.item.price = parseFloat(vmPlanItemGroup.planItemGroup.item.price.replace(/[^\d.]/g, ''));
                }
                if (!vmPlanItemGroup.planItemGroup.item.price) {
                    vmPlanItemGroup.planItemGroup.item.price = 0;
                }
                $uibModalInstance.close(vmPlanItemGroup.planItemGroup);
            }
            else {
                $uibModal.open({
                    templateUrl: 'core/confirmationModal.html',
                    controller: 'ConfirmationModalInstanceController',
                    controllerAs: 'vmConfirmation',
                    resolve: {
                        message: function () {
                            return "Are you sure you want to post a question without answer?";
                        },
                        type: function () {
                            return ConfirmationModalTypes.warning;
                        },
                        yesNo: function () {
                            return false;
                        }
                    }
                }).result.then(function () {
                    vmPlanItemGroup.planItemGroup.item = null;
                    $uibModalInstance.close(vmPlanItemGroup.planItemGroup);
                });
            }
        }

    }

})();