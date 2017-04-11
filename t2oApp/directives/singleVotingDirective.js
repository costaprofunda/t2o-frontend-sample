/**
 * Created by cpro on 01.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('singleVoting', singleVoting);

    singleVoting.$inject = ['$uibModal', '$timeout', 'ScrollTo', 'Messages', 'ConfirmationModalTypes', 'ItemReviewService'];

    function singleVoting($uibModal, $timeout, ScrollTo, Messages, ConfirmationModalTypes, ItemReviewService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/singleVoting.html',
            scope: {
                question: '=',
                title: '@',
                user: '=',
                participants: '=?',
                planId: '@',
                numberToAgree: '@',
                openedShares: '=?',
                totalShares: '@',
                chat: '='
            },
            controller: function ($scope) {

                $scope.onExpand = onExpand;
                $scope.toggleVote = toggleVote;
                $scope.isUserSharePlan = isUserSharePlan;
                $scope.onChat = onChat;

                function onExpand() {
                    if (isUserSharePlan()) {
                        if (!$scope.question.showChatArea) {
                            $scope.chat($scope.question, $scope.question.objId, 'ready-to-buy-voting');
                        }
                        var content = angular.element('#ready-to-buy-voting-content');
                        if (angular.isUndefined($scope.question.expanded)) {
                            $scope.question.expanded = false;
                        }
                        if (!$scope.question.expanded) {
                            content.slideToggle(100);
                            $scope.question.expanded = true;
                        }
                        else {
                            content.slideToggle(100);
                            $timeout(function () {
                                $scope.question.expanded = false;
                                ScrollTo.idOrName('ready-to-buy-head');
                            }, 100);
                        }
                    }
                }

                function toggleVote(question) {
                    if (question.votes.indexOf($scope.user.id) >= 0) {
                        ItemReviewService.unVoteForPlanObject(question.objId);
                    }
                    else {
                        if (!isVoteFinal(question)) {
                            ItemReviewService.voteForPlanObject(question.objId);
                        }
                        else {
                            $uibModal.open({
                                templateUrl: 'core/confirmationModal.html',
                                controller: 'ConfirmationModalInstanceController',
                                controllerAs: 'vmConfirmation',
                                resolve: {
                                    message: function () {
                                        return Messages.goToBuying;
                                    },
                                    type: function () {
                                        return ConfirmationModalTypes.warning;
                                    },
                                    yesNo: function () {
                                        return false;
                                    }
                                }
                            }).result.then(function () {
                                ItemReviewService.voteForPlanObject(question.objId);
                            });
                        }
                    }
                }

                function isVoteFinal(item) {
                    var upcomingVote = 0;
                    var totalShared = 0;
                    var voted = 0;
                    $scope.participants.forEach(function (participant) {
                        totalShared += participant.shares;
                        if ($scope.user.id === participant.userId) {
                            upcomingVote = participant.shares;
                        }
                    });
                    item.votes.forEach(function (votedId) {
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
                    return 0;
                }

                function isUserSharePlan(userId) {
                    if (!userId) {
                        if (!$scope.user) return false;
                        userId = $scope.user.id;
                    }
                    for (var i = 0; i < $scope.participants.length; i++) {
                        if ($scope.participants[i].userId === userId) {
                            return true;
                        }
                    }
                    return false;
                }

                function onChat(objId) {
                    $scope.chat(objId);
                }
            }
        };
    }

})();