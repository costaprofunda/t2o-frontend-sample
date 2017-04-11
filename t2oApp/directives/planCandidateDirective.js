/**
 * Created by cpro on 27.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('planCandidate', planCandidate);

    planCandidate.$inject = ['$uibModal', '$timeout', 'ScrollTo', 'Messages', 'ConfirmationModalTypes', 'ItemReviewService'];

    function planCandidate($uibModal, $timeout, ScrollTo, Messages, ConfirmationModalTypes, ItemReviewService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/planCandidate.html',
            scope: {
                position: '@',
                candidates: '=?',
                user: '=',
                participants: '=?',
                planId: '@',
                numberToAgree: '@',
                totalShares: '@',
                propose: '&',
                disableVoting: '=?',
                chat: '=',
                readyToBuy: '=?'
            },
            controller: function ($scope) {
                $scope.expanded = false;

                $scope.isUserAmongCandidates = isUserAmongCandidates;
                $scope.isTied = isTied;
                $scope.onExpand = onExpand;
                $scope.onRequestExpand = onRequestExpand;
                $scope.isUserSharePlan = isUserSharePlan;
                $scope.toggleVote = toggleVote;

                function isUserAmongCandidates() {
                    if (!$scope.user) return false;
                    for (var i = 0; i < $scope.candidates.length; i++) {
                        if ($scope.candidates[i].userId === $scope.user.id) {
                            return true;
                        }
                    }
                    return false;
                }

                function isTied() {
                    return (($scope.candidates.length > 1) && $scope.candidates[0].accepted && $scope.candidates[1].accepted);
                }

                function onExpand() {
                    if (!!$scope.user && !!$scope.candidates.length && isUserSharePlan()) {
                        if (!$scope.candidates[0].showChatArea) {
                            $scope.chat($scope.candidates[0], $scope.candidates[0].objId, 'treasurers');
                        }
                        var content = angular.element(document.getElementById('treasurer-voting-content'));
                        if (!$scope.expanded) {
                            content.slideToggle(100);
                            $scope.expanded = true;
                        }
                        else {
                            content.slideToggle(100);
                            $timeout(function () {
                                $scope.expanded = false;
                                ScrollTo.idOrName('treasurer-voting-head');
                            }, 100);
                        }
                    }
                }

                function onRequestExpand(request) {
                    if (angular.isUndefined(request.expanded)) {
                        request.expanded = false;
                    }
                    request.expanded = !request.expanded;
                }

                function toggleVote(request) {
                    if (request.votes.indexOf($scope.user.id) !== -1) {
                        if (!!$scope.readyToBuy && isUnvoteSignificant(request)) {
                            $uibModal.open({
                                templateUrl: 'core/confirmationModal.html',
                                controller: 'ConfirmationModalInstanceController',
                                controllerAs: 'vmConfirmation',
                                resolve: {
                                    message: function () {
                                        return sprintf(Messages.notifyBeforeUnvoteTreasurer, {
                                            name: request.firstName + ' ' + request.lastName
                                        });
                                    },
                                    type: function () {
                                        return ConfirmationModalTypes.warning;
                                    },
                                    yesNo: function () {
                                        return false;
                                    }
                                }
                            }).result.then(function () {
                                ItemReviewService.unVoteForPlanObject(request.objId);
                            });
                        }
                        else {
                            ItemReviewService.unVoteForPlanObject(request.objId);
                        }
                    }
                    else {
                        ItemReviewService.voteForPlanObject(request.objId);
                    }
                }

                function isUnvoteSignificant(request) {
                    var unvotedItem = angular.copy(request);
                    unvotedItem.votes.splice(unvotedItem.votes.indexOf($scope.user.id), 1);
                    var totalShared = 0;
                    var voted = 0;
                    $scope.participants.forEach(function (participant) {
                        totalShared += participant.shares;
                    });
                    unvotedItem.votes.forEach(function (votedId) {
                        voted += getSharesById(votedId);
                    });
                    console.log("agreement: ", $scope.numberToAgree / $scope.totalShares * 100);
                    console.log("count: ", voted / totalShared * 100);
                    return ($scope.numberToAgree / $scope.totalShares) > (voted / totalShared);
                }

                function getSharesById(id) {
                    for (var i = 0; i < $scope.participants.length; i++) {
                        if ($scope.participants[i].userId === id) {
                            return $scope.participants[i].shares;
                        }
                    }
                    return 1;
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
            }
        };
    }

})();