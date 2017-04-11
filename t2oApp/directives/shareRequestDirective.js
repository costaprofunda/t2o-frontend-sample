/**
 * Created by cpro on 28.10.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('shareRequest', shareRequest);

    shareRequest.$inject = ['$uibModal', '$timeout', 'growl', 'ScrollTo', 'Messages', 'ConfirmationModalTypes', 'ItemReviewService'];

    function shareRequest($uibModal, $timeout, growl, ScrollTo, Messages, ConfirmationModalTypes, ItemReviewService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/shareRequest.html',
            scope: {
                request: '=',
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
                        if (!$scope.request.showChatArea) {
                            $scope.chat($scope.request, $scope.request.objId, $scope.request.userId);
                        }
                        var content = angular.element(document.getElementById('share-request-content-' + $scope.request.userId));
                        if (angular.isUndefined($scope.request.expanded)) {
                            $scope.request.expanded = false;
                        }
                        if (!$scope.request.expanded) {
                            content.slideToggle(100);
                            $scope.request.expanded = true;
                        }
                        else {
                            content.slideToggle(100);
                            $timeout(function () {
                                $scope.request.expanded = false;
                                ScrollTo.idOrName('share-request-head-' + $scope.request.userId);
                            }, 100);
                        }
                    }
                }

                function toggleVote(request) {
                    if (request.votes.indexOf($scope.user.id) >= 0) {
                        ItemReviewService.unVoteForPlanObject(request.objId);
                    }
                    else {
                        if (!isVoteFinal(request)) {
                            ItemReviewService.voteForPlanObject(request.objId);
                        }
                        else {
                            if (!request.lowerShares && (request.shares > $scope.openedShares)) {
                                //"We'll check with %(userName) to see if He/She is willing to join. He/She requested %(sharesRequested)s shares, and there are only %(sharesRemained)s remaining"
                                growl.addInfoMessage(sprintf(Messages.unableToVote, {
                                    userName: request.firstName + " " + request.lastName,
                                    sharesRequested: request.shares,
                                    sharesRemained: $scope.openedShares
                                }));
                            }
                            else {
                                $uibModal.open({
                                    templateUrl: 'core/confirmationModal.html',
                                    controller: 'ConfirmationModalInstanceController',
                                    controllerAs: 'vmConfirmation',
                                    resolve: {
                                        message: function () {
                                            return sprintf(Messages.addToTeam, {
                                                name: request.firstName + " " + request.lastName
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
                                    ItemReviewService.voteForPlanObject(request.objId);
                                });
                            }
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