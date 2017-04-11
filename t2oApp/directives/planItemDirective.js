/**
 * Created by cpro on 16.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('planItem', planItem);

    planItem.$inject = ['$uibModal', '$timeout', 'ScrollTo', 'Messages', 'ConfirmationModalTypes', 'ItemReviewService'];

    function planItem($uibModal, $timeout, ScrollTo, Messages, ConfirmationModalTypes, ItemReviewService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/planItem.html',
            scope: {
                group: '=',
                user: '=',
                participants: '=?',
                planId: '@',
                numberToAgree: '@',
                totalShares: '@',
                expandable: '@',
                addAlternative: '&',
                editItem: '=',
                addRejection: '&',
                unsharedPrice: '=?',
                disableVoting: '=?',
                chat: '=',
                readyToBuy: '=?'
            },
            controller: function ($scope) {
                $scope.group.expanded = false;

                $scope.onExpand = onExpand;
                $scope.toggleVote = toggleVote;
                $scope.isUserSharePlan = isUserSharePlan;
                $scope.showInfo = showInfo;
                $scope.showScrapInfo = showScrapInfo;
                $scope.isTied = isTied;
                $scope.editItemDir = editItemDir;
                $scope.getSharedPrice = getSharedPrice;
                $scope.isScrapFavor = isScrapFavor;
                $scope.areDetailsFilled = areDetailsFilled;

                function onExpand() {
                    if (isUserSharePlan()) {
                        if (!$scope.group.showChatArea) {
                            $scope.chat($scope.group, $scope.group.question.objId, $scope.group.question.id);
                        }
                        var content = angular.element(document.getElementById('item-content-' + $scope.group.question.id));
                        if (!$scope.group.expanded) {
                            content.slideToggle(100);
                            $scope.group.expanded = true;
                        }
                        else {
                            content.slideToggle(100);
                            $timeout(function () {
                                $scope.group.expanded = false;
                                ScrollTo.idOrName('item-head-' + $scope.group.question.id);
                            }, 100);
                        }
                    }
                }

                function toggleVote(item, scrapped) {

                    var objId = (!scrapped) ? item.objId : $scope.group.scrap.objId;

                    if (item.votes.indexOf($scope.user.id) !== -1) {
                        if ($scope.group.question.vital && !!$scope.readyToBuy && isUnvoteSignificant(item)) {
                            $uibModal.open({
                                templateUrl: 'core/confirmationModal.html',
                                controller: 'ConfirmationModalInstanceController',
                                controllerAs: 'vmConfirmation',
                                resolve: {
                                    message: function () {
                                        return sprintf(Messages.notifyBeforeUnvoteVendor, {name: item.name});
                                    },
                                    type: function () {
                                        return ConfirmationModalTypes.warning;
                                    },
                                    yesNo: function () {
                                        return false;
                                    }
                                }
                            }).result.then(function () {
                                ItemReviewService.unVoteForPlanObject(objId);
                            });
                        }
                        else {
                            ItemReviewService.unVoteForPlanObject(objId);
                        }
                    }
                    else {
                        if (!isVoteFinal(item) || !scrapped) {
                            ItemReviewService.voteForPlanObject(objId);
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
                                ItemReviewService.voteForPlanObject(objId);
                            });
                        }
                    }
                }

                function isTied() {
                    return (($scope.group.items.length > 1) && $scope.group.items[0].accepted && $scope.group.items[1].accepted);
                }

                function isUnvoteSignificant(item) {
                    var unvotedItem = angular.copy(item);
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

                function showInfo(item) {
                    var content = angular.element(document.getElementById('item-info-' + $scope.group.question.id + '-' + $scope.group.items.indexOf(item)));
                    if (angular.isUndefined(item.infoExpanded)) {
                        item.infoExpanded = false;
                    }
                    if (!item.infoExpanded) {
                        content.slideToggle(100);
                        item.infoExpanded = true;
                    }
                    else {
                        content.slideToggle(100);
                        $timeout(function () {
                            item.infoExpanded = false;
                        }, 100);
                    }
                }

                function showScrapInfo() {
                    var content = angular.element(document.getElementById('scrap-info-' + $scope.group.question.id));
                    if (angular.isUndefined($scope.group.scrap.infoExpanded)) {
                        $scope.group.scrap.infoExpanded = false;
                    }
                    if (!$scope.group.scrap.infoExpanded) {
                        content.slideToggle(100);
                        $scope.group.scrap.infoExpanded = true;
                    }
                    else {
                        content.slideToggle(100);
                        $timeout(function () {
                            $scope.group.scrap.infoExpanded = false;
                        }, 100);
                    }
                }

                function editItemDir(item) {
                    $scope.editItem($scope.group, item);
                }

                function getSharedPrice(price) {
                    if (!$scope.user) return (price / $scope.totalShares).toFixed(2);
                    return ((price / $scope.totalShares) * getSharesById($scope.user.id)).toFixed(2);
                }

                function isScrapFavor() {
                    if (!!$scope.group.scrap) {
                        var votedForScrap = 0;
                        var votedForFirst = 0;
                        $scope.group.scrap.votes.forEach(function (votedId) {
                            votedForScrap += getSharesById(votedId);
                        });
                        if (!!$scope.group.items.length) {
                            $scope.group.items[0].votes.forEach(function (votedId) {
                                votedForFirst += getSharesById(votedId);
                            });
                            return (votedForScrap > votedForFirst);
                        }
                        else {
                            return true;
                        }
                    }
                    return false;
                }

                function areDetailsFilled(item) {
                    return (!!item.price
                         || !!item.description
                         || !!item.url
                         || !!item.provider
                         || !!item.goodDeal
                         || !!item.phone
                         || !!item.email
                         || !!item.contactName);
                }

            }
        };
    }

})();