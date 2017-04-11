/**
 * Created by cpro on 01.12.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('twoAltVote', twoAltVote);

    twoAltVote.$inject = ['$uibModal', 'ConfirmationModalTypes', 'ItemReviewService'];

    function twoAltVote($uibModal, ConfirmationModalTypes, ItemReviewService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/twoAltVote.html',
            scope: {
                firstAltItems: '=',
                secondAltItems: '=',
                firstAltCaption: '@',
                secondAltCaption: '@',
                title: '@',
                user: '=',
                participants: '=?',
                planId: '@',
                numberToAgree: '@',
                totalShares: '@',
                linkClick: '&'
            },
            controller: function ($scope) {

                $scope.toggleVote = toggleVote;

                function toggleVote(items, secondAlt) {
                    var voteMethod;
                    var unVoteMethod;

                    var info = {
                        planId: $scope.planId
                    };
                    voteMethod = (!secondAlt) ?
                        ItemReviewService.voteForPlanContinue : ItemReviewService.voteForPlanFinish;
                    unVoteMethod = (!secondAlt) ?
                        ItemReviewService.unVoteForPlanContinue : ItemReviewService.unVoteForPlanFinish;

                    if (items.indexOf($scope.user.id) >= 0) {
                        unVoteMethod(info);
                    }
                    else {
                        if (!isVoteFinal(items)) {
                            voteMethod(info);

                        }
                        else {
                            $uibModal.open({
                                templateUrl: 'core/confirmationModal.html',
                                controller: 'ConfirmationModalInstanceController',
                                controllerAs: 'vmConfirmation',
                                resolve: {
                                    message: function () {
                                        return "Your vote will be final and cannot be reverted. Are you sure?";
                                    },
                                    type: function () {
                                        return ConfirmationModalTypes.warning;
                                    },
                                    yesNo: function () {
                                        return false;
                                    }
                                }
                            }).result.then(function () {
                                voteMethod(info);
                            });
                        }

                    }
                }

                function isVoteFinal(items) {
                    var upcomingVote = 0;
                    var totalShared = 0;
                    var voted = 0;
                    $scope.participants.forEach(function (participant) {
                        totalShared += participant.shares;
                        if ($scope.user.id === participant.userId) {
                            upcomingVote = participant.shares;
                        }
                    });
                    items.forEach(function (votedId) {
                        voted += getSharesById(votedId);
                    });
                    console.log("agreement: ", $scope.numberToAgree / $scope.totalShares * 100);
                    console.log("count: ", (voted + upcomingVote) / totalShared * 100);
                    return ($scope.numberToAgree / $scope.totalShares) <= ((voted + upcomingVote) / totalShared);
                }

                function getSharesById(id) {
                    for (var i = 0; i < $scope.participants.length; i++) {
                        if ($scope.participants[i].userId === id) {
                            return $scope.participants[i].shares;
                        }
                    }
                }
            }
        };
    }

})();