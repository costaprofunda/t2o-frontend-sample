/**
 * Created by cpro on 13.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .controller('ItemReviewController', ItemReviewController);

    ItemReviewController.$inject = ['$scope', '$state', '$timeout', '$uibModal', '$filter', 'growl', 'ScrollTo', 'Utils', 'Sizes', 'Messages', 'Events', 'States', 'ConfirmationModalTypes', 'ImageService', 'ItemReviewService', 'SocialSharingService', 'PaymentControlService', 'ChatService', 'plan'];

    function ItemReviewController($scope, $state, $timeout, $uibModal, $filter, growl, ScrollTo, Utils, Sizes, Messages, Events, States, ConfirmationModalTypes, ImageService, ItemReviewService, SocialSharingService, PaymentControlService, ChatService, plan) {
        var vmItemReview = this;

        var planItemGroupTypeList = null;

        vmItemReview.questions = [];
        vmItemReview.expired = false;
        vmItemReview.plan = plan;
        vmItemReview.mainImageNumber = 1;
        vmItemReview.planImageUrl = ImageService.getPlanImageById(vmItemReview.plan.id, vmItemReview.mainImageNumber, Sizes.large);
        vmItemReview.unsharedPriceForItems = false;
        vmItemReview.planNotificationMessages = [];
        vmItemReview.planImages = [];

        for (var i = 0; i < vmItemReview.plan.imagesCount; i++) {
            vmItemReview.planImages.push({
                number: i + 1,
                url: ImageService.getPlanImageById(vmItemReview.plan.id, i + 1, Sizes.small)
            });
        }

        vmItemReview.categoryList = $scope.vmMain.categoryList;
        if (!vmItemReview.categoryList.length) {
            var unregisterCategoryList = $scope.$watchCollection('vmMain.categoryList', function (newVal, oldVal) {
                if (!angular.equals(newVal, oldVal) && !!newVal.length) {
                    unregisterCategoryList();
                    initCategoryName();
                }
            });
        }

        vmItemReview.userInfo = $scope.vmMain.userInfo;
        vmItemReview.categoryName = {parent: '', child: ''};
        if (!vmItemReview.userInfo) {
            var unregisteredUserInfo = $scope.$watch('vmMain.userInfo', function (newVal, oldVal) {
                if (!!newVal && !angular.equals(newVal, oldVal)) {
                    vmItemReview.userInfo = newVal;
                    processPlan();
                    unregisteredUserInfo();
                }
            });
        }

        initQuestions();
        processPlan();
        vmItemReview.newPlanInfo = ItemReviewService.getPlanInfo(vmItemReview.plan);

        $timeout(function () {
            ScrollTo.idOrName('plan-status');
        }, 100);

        vmItemReview.onShareRequestClick = onShareRequestClick;
        vmItemReview.isUserSharePlan = isUserSharePlan;
        vmItemReview.isUserSentShareRequest = isUserSentShareRequest;
        vmItemReview.exitPlan = exitPlan;
        vmItemReview.copyPlan = copyPlan;
        vmItemReview.addNewPlanItemGroup = addNewPlanItemGroup;
        vmItemReview.saveOrUpdateItem = saveOrUpdateItem;
        vmItemReview.addRejection = addRejection;
        vmItemReview.isIncreasingStakeAvailable = isIncreasingStakeAvailable;
        vmItemReview.onSendEmailClick = onSendEmailClick;
        vmItemReview.publishToFacebook = publishToFacebook;
        vmItemReview.becomeATreasurer = becomeATreasurer;
        vmItemReview.isUserPaid = isUserPaid;
        vmItemReview.markUserAsPaid = markUserAsPaid;
        vmItemReview.showChat = showChat;
        vmItemReview.showPlanInfo = showPlanInfo;
        vmItemReview.onNotificationMessageClick = onNotificationMessageClick;
        vmItemReview.onVotingFilterClick = onVotingFilterClick;
        vmItemReview.isQuestionHidden = isQuestionHidden;
        vmItemReview.voteForReadyToBuy = voteForReadyToBuy;
        vmItemReview.onImageClick = onImageClick;
        vmItemReview.isUserAbleToEditPlan = isUserAbleToEditPlan;
        vmItemReview.slideImage = slideImage;
        vmItemReview.getPlanOwnerInfo = getPlanOwnerInfo;

        $scope.$on(Events.logout, function () {
            vmItemReview.userInfo = null;
            processPlan();
        });

        $scope.$on(Events.joinRequest, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.joinRequests.push(data.item);
            }
        });

        $scope.$on(Events.joinRequestVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vote(data, 'joinRequests', 'userId');
            }
        });

        $scope.$on(Events.joinRequestUnVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vote(data, 'joinRequests', 'userId', true);
            }
        });

        $scope.$on(Events.joinRequestAccepted, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                refreshPlan();
            }
        });

        $scope.$on(Events.increaseStakeRequest, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.increaseStakeRequests.push(data.item);
            }
        });

        $scope.$on(Events.increaseStakeRequestVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                if (data.accepted) {
                    refreshPlan();
                }
                else {
                    vote(data, 'increaseStakeRequests', 'userId');
                }
            }
        });

        $scope.$on(Events.increaseStakeRequestUnVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vote(data, 'increaseStakeRequests', 'userId', true);
            }
        });

        $scope.$on(Events.increaseStakeRequestAccepted, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                refreshPlan();
            }
        });

        $scope.$on(Events.exitPlan, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                if (data.userId === vmItemReview.userInfo.id) {
                    $uibModal.open({
                        templateUrl: 'core/confirmationModal.html',
                        controller: 'ConfirmationModalInstanceController',
                        controllerAs: 'vmConfirmation',
                        resolve: {
                            message: function () {
                                return "Would you like to create your own copy of left plan?";
                            },
                            type: function () {
                                return ConfirmationModalTypes.question;
                            },
                            yesNo: function () {
                                return true;
                            }
                        }
                    }).result.then(copyPlan, function () {
                        $state.go('home.itemList');
                    });
                }
            }
        });

        $scope.$on(Events.kickUnpaidUsers, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                refreshPlan();
            }
        });

        $scope.$on(Events.planItemGroupAdded, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.itemGroups.push(data.item);
            }
        });

        $scope.$on(Events.planItemAdded, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                // itemGroup.items.forEach(function (item) {
                //     item.accepted = data.accepted[item.objId];
                //     var userIdIndex = item.votes.indexOf(data.item.userId);
                //     if (userIdIndex >= 0) {
                //         item.votes.splice(userIdIndex, 1);
                //     }
                // });
                // if (!!itemGroup.scrap) {
                //     var votedForScrapUserIdIndex = itemGroup.scrap.votes.indexOf(data.item.userId);
                //     if (votedForScrapUserIdIndex >= 0) {
                //         itemGroup.scrap.votes.splice(votedForScrapUserIdIndex, 1);
                //     }
                // }
                itemGroup.items.push(data.item);
                // itemGroup.accepted = data.itemGroupAccepted;
                // itemGroup.items = sortItems(itemGroup.items);
                // recalculatePrice();
            }
        });

        $scope.$on(Events.planItemUpdated, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                var item = $filter('property')(itemGroup.items, 'objId', data.item.objId)[0];
                itemGroup.items.splice(itemGroup.items.indexOf(item), 1);
                itemGroup.items.push(data.item);
                // itemGroup.accepted = data.itemGroupAccepted;
                itemGroup.items = sortItems(itemGroup.items);
                recalculatePrice();
            }
        });

        $scope.$on(Events.planItemVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                var item = $filter('property')(itemGroup.items, 'objId', data.itemId)[0];
                item.votes.push(data.votedUserId);
                item.accepted = data.accepted;
                // itemGroup.items.forEach(function (item) {
                    // item.accepted = data.accepted[item.objId];
                    // var votedForItemUserIdIndex = item.votes.indexOf(data.votedUserId);
                    // if (votedForItemUserIdIndex >= 0) {
                    //     item.votes.splice(votedForItemUserIdIndex, 1);
                    // }
                    // if (item.objId === data.itemId) {
                    //     item.votes.push(data.votedUserId);
                    // }
                // });
                // if (!!itemGroup.scrap) {
                //     var votedForScrapUserIdIndex = itemGroup.scrap.votes.indexOf(data.votedUserId);
                //     if (votedForScrapUserIdIndex >= 0) {
                //         itemGroup.scrap.votes.splice(votedForScrapUserIdIndex, 1);
                //     }
                // }
                // itemGroup.accepted = data.itemGroupAccepted;
                itemGroup.items = sortItems(itemGroup.items);
                // recalculatePrice();
            }
        });

        $scope.$on(Events.planItemUnVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                var item = $filter('property')(itemGroup.items, 'objId', data.itemId)[0];
                item.votes.splice(item.votes.indexOf(data.unVotedUserId), 1);
                item.accepted = data.accepted;
                // itemGroup.accepted = data.itemGroupAccepted;
                itemGroup.items = sortItems(itemGroup.items);
                // recalculatePrice();
            }
        });

        $scope.$on(Events.planItemGroupAccepted, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                itemGroup.accepted = data.accepted;
                recalculatePrice();
            }
        });

        $scope.$on(Events.scrapPlanItemGroup, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                // if (data.accepted) {
                //     vmItemReview.plan.itemGroups.splice(vmItemReview.plan.itemGroups.indexOf(itemGroup), 1);
                //     processPlan();
                // }
                // else {
                    itemGroup.scrap = data.item;
                //     itemGroup.items.forEach(function (item) {
                //         item.accepted = data.itemsAccepted[item.objId];
                //         var votedForItemUserIdIndex = item.votes.indexOf(data.item.userId);
                //         if (votedForItemUserIdIndex >= 0) {
                //             item.votes.splice(votedForItemUserIdIndex, 1);
                //         }
                //     });
                //     itemGroup.accepted = data.itemGroupAccepted;
                // }
            }
        });

        $scope.$on(Events.scrapVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                // if (data.accepted) {
                //     growl.addSuccessMessage(sprintf(Messages.itemScrapped, {questionName: itemGroup.question.title}));
                //     vmItemReview.plan.itemGroups.splice(vmItemReview.plan.itemGroups.indexOf(itemGroup), 1);
                //     processPlan();
                // }
                // else {
                    itemGroup.scrap.votes.push(data.votedUserId);
                //     itemGroup.items.forEach(function (item) {
                //         item.accepted = data.itemsAccepted[item.objId];
                //         var votedForItemUserIdIndex = item.votes.indexOf(data.votedUserId);
                //         if (votedForItemUserIdIndex >= 0) {
                //             item.votes.splice(votedForItemUserIdIndex, 1);
                //         }
                //     });
                //     itemGroup.accepted = data.itemGroupAccepted;
                // }
            }
        });

        $scope.$on(Events.scrapUnVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                itemGroup.scrap.votes.splice(itemGroup.scrap.votes.indexOf(data.unVotedUserId), 1);
            }
        });

        $scope.$on(Events.scrapAccepted, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                var itemGroup = $filter('property')(vmItemReview.plan.itemGroups, 'question.id', data.questionId)[0];
                growl.addSuccessMessage(sprintf(Messages.itemScrapped, {questionName: itemGroup.question.title}));
                vmItemReview.plan.itemGroups.splice(vmItemReview.plan.itemGroups.indexOf(itemGroup), 1);
                processPlan();
            }
        });

        $scope.$on(Events.treasurerRequest, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                // vmItemReview.plan.treasurerRequests.forEach(function (request) {
                //     var userIdIndex = request.votes.indexOf(data.item.proposer.id);
                //     if (userIdIndex >= 0) {
                //         request.votes.splice(userIdIndex, 1);
                //     }
                // });
                vmItemReview.plan.treasurerRequests.push(data.item);
                // vmItemReview.plan.treasurerRequests = $filter('planCandidateItemsOrder')(vmItemReview.plan.treasurerRequests);
            }
        });

        $scope.$on(Events.treasurerRequestVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                // vmItemReview.plan.treasurerRequests.forEach(function (request) {
                //     var votedUserIdIndex = request.votes.indexOf(data.votedUserId);
                //     if (votedUserIdIndex >= 0) {
                //         request.votes.splice(votedUserIdIndex, 1);
                //     }
                // });
                vote(data, 'treasurerRequests', 'userId');
                var request = $filter('property')(vmItemReview.plan.treasurerRequests, 'userId', data.userId)[0];
                request.accepted = data.accepted;
                vmItemReview.plan.treasurerRequests = $filter('planCandidateItemsOrder')(vmItemReview.plan.treasurerRequests, vmItemReview.plan.shares);
                // if (data.acceptedTreasurer) {
                //     processPlan();
                //     console.log("We have a treasurer: ", data.userId);
                // }
            }
        });

        $scope.$on(Events.treasurerRequestUnVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vote(data, 'treasurerRequests', 'userId', true);
                var request = $filter('property')(vmItemReview.plan.treasurerRequests, 'userId', data.userId)[0];
                request.accepted = data.accepted;
                // request.accepted = false;
                //vmItemReview.plan.treasurerRequests = $filter('orderBy')(vmItemReview.plan.treasurerRequests, '-accepted');
                vmItemReview.plan.treasurerRequests = $filter('planCandidateItemsOrder')(vmItemReview.plan.treasurerRequests, vmItemReview.plan.shares);
                // if (data.acceptedTreasurer) {
                //     console.log("We have a treasurer: ", data.userId);
                // }
            }
        });

        $scope.$on(Events.treasurerRequestAccepted, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                processPlan();
                // vmItemReview.plan.treasurerRequests.forEach(function (request) {
                //     var userIdIndex = request.votes.indexOf(data.item.proposer.id);
                //     if (userIdIndex >= 0) {
                //         request.votes.splice(userIdIndex, 1);
                //     }
                // });
                // vmItemReview.plan.treasurerRequests.push(data.item);
                // vmItemReview.plan.treasurerRequests = $filter('planCandidateItemsOrder')(vmItemReview.plan.treasurerRequests);
            }
        });

        $scope.$on(Events.markUserAsPaid, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.payment.paid.push({userId: data.item.userId});
                countPaymentComplete();
                if (!!data.item.finalPayment) {
                    refreshPlan();
                }
            }
        });

        $scope.$on(Events.planStatusChanged, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.state = data.state;
                refreshPlan();
            }
        });

        $scope.$on(Events.readyToBuyAdded, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.readyToBuy = data.readyToBuy;
            }
        });

        $scope.$on(Events.readyToBuyRemoved, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.readyToBuy = null;
            }
        });

        $scope.$on(Events.readyToBuyVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.readyToBuy.votes.push(data.votedUserId);
            }
        });

        $scope.$on(Events.readyToBuyUnVote, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                vmItemReview.plan.readyToBuy.votes.splice(vmItemReview.plan.readyToBuy.votes.indexOf(data.unVotedUserId), 1);
            }
        });

        $scope.$on(Events.readyToBuyAccepted, function (event, data) {
            if (data.planId === vmItemReview.plan.id) {
                refreshPlan();
            }
        });

        function initItemFilter() {
            vmItemReview.itemFilter = {
                selected: null,
                items: [
                    {
                        name: 'All Votes',
                        identity: 'ALL_VOTES'
                    },
                    {
                        name: 'Passed Votes',
                        identity: 'PASSED_VOTES'
                    },
                    {
                        name: 'Pending Votes',
                        identity: 'PENDING_VOTES'
                    }
                ],
                expanded: false
            };
            vmItemReview.itemFilter.selected = vmItemReview.itemFilter.items[0];
        }

        function initQuestions() {
            ItemReviewService.getQuestionListByCategory(vmItemReview.plan.categoryId).then(function (questions) {
                vmItemReview.questions = questions;
            });
        }

        function vote(data, collectionName, idPropertyName, unVote) {
            var item = $filter('property')(vmItemReview.plan[collectionName], idPropertyName, data[idPropertyName])[0];
            if (!unVote) {
                item.votes.push(data.votedUserId);
            }
            else {
                item.votes.splice(item.votes.indexOf(data.unVotedUserId), 1);
            }
        }

        function refreshPlan() {
            ItemReviewService.getPlanById(vmItemReview.plan.id).then(function (refreshedPlan) {
                vmItemReview.plan = refreshedPlan;
                vmItemReview.mainImageNumber = 1;
                vmItemReview.planImageUrl = ImageService.getPlanImageById(refreshedPlan.id, vmItemReview.mainImageNumber, Sizes.large, true);
                vmItemReview.planImages = [];
                for (var i = 0; i < vmItemReview.plan.imagesCount; i++) {
                    vmItemReview.planImages.push({
                        number: i + 1,
                        url: ImageService.getPlanImageById(refreshedPlan.id, i + 1, Sizes.small, true)
                    });
                }
                processPlan();
            });
        }

        function recalculatePrice() {
            var unsharedTotalUpfrontCost = 0;
            var sharedTotalUpfrontCost = 0;
            var unsharedTotalRecurring = 0;
            var sharedTotalRecurring = 0;
            var unsharedTotalFirstYearCost = 0;
            var sharedTotalFirstYearCost = 0;

            var passedItemGroups = $filter('property')(vmItemReview.plan.itemGroups, 'accepted', true);

            passedItemGroups.forEach(function (group) {
                var passedItem = $filter('property')(group.items, 'accepted', true)[0];
                if (passedItem.reoccurringPrice) {
                    unsharedTotalRecurring += passedItem.price;
                }
                else {
                    unsharedTotalUpfrontCost += passedItem.price;
                }
            });

            var shareCount = 1;
            if (!!vmItemReview.ownedShares) {
                shareCount = vmItemReview.ownedShares;
            }

            sharedTotalUpfrontCost = (unsharedTotalUpfrontCost / vmItemReview.plan.totalShares * shareCount).toFixed(2);
            sharedTotalRecurring = (unsharedTotalRecurring / vmItemReview.plan.totalShares * shareCount).toFixed(2);

            unsharedTotalFirstYearCost = (parseFloat(unsharedTotalUpfrontCost) + parseFloat(unsharedTotalRecurring)).toFixed(2);
            sharedTotalFirstYearCost = (parseFloat(sharedTotalUpfrontCost) + parseFloat(sharedTotalRecurring)).toFixed(2);

            vmItemReview.priceInfo = {
                unsharedTotalUpfrontCost: unsharedTotalUpfrontCost,
                sharedTotalUpfrontCost: sharedTotalUpfrontCost,
                unsharedTotalRecurring: unsharedTotalRecurring,
                sharedTotalRecurring: sharedTotalRecurring,
                unsharedTotalFirstYearCost: unsharedTotalFirstYearCost,
                sharedTotalFirstYearCost: sharedTotalFirstYearCost
            };
        }

        function processPlan() {
            vmItemReview.neededAgreement = (vmItemReview.plan.numberToAgree / vmItemReview.plan.totalShares * 100).toFixed(0);
            vmItemReview.ownedShares = 0;
            vmItemReview.joinedShares = 0;
            angular.forEach(vmItemReview.plan.shares, function (share) {
                vmItemReview.joinedShares += share.shares;
                if ((!!vmItemReview.userInfo) && (share.userId === vmItemReview.userInfo.id)) {
                    vmItemReview.ownedShares = share.shares;
                }
            });
            vmItemReview.openedShares = vmItemReview.plan.totalShares - vmItemReview.joinedShares;

            vmItemReview.daysToGo = 0;
            vmItemReview.daysToGo = Utils.getDaysUntilNow(vmItemReview.plan.expiration);
            vmItemReview.expired = (vmItemReview.plan.state !== States.purchasing) || (vmItemReview.daysToGo <= 0);

            vmItemReview.planNotificationMessages = [];

            if (vmItemReview.expired && !isTreasurerSelected()) {
                //Only %(supported)s out of %(totalMembers)s team members support %(collectorName)s as the money collector. To close the plan, at least %(sharesToPass)s more shares will need to support a money collector
                var treasurerNotAcceptedMessage = (!vmItemReview.plan.treasurerRequests.length)
                    ? Messages.treasurerNotAcceptedAlternative
                    : sprintf(Messages.treasurerNotAccepted, {
                    supported: vmItemReview.plan.treasurerRequests[0].votes.length,
                    totalMembers: vmItemReview.plan.shares.length,
                    collectorName: vmItemReview.plan.treasurerRequests[0].firstName + ' ' + vmItemReview.plan.treasurerRequests[0].lastName,
                    productName: vmItemReview.plan.title,
                    sharesToPass: getSharesToPass(vmItemReview.plan.treasurerRequests[0].votes)
                });
                addNotificationMessage(treasurerNotAcceptedMessage, 'treasurer-voting-head');
            }
            if (vmItemReview.expired && !!vmItemReview.openedShares) {
                addNotificationMessage(sprintf(Messages.planHasOpenShares, {
                    increaseStakeAction: 'vmItemReview.onShareRequestClick()',
                    inviteAction: 'vmItemReview.onSendEmailClick()'
                }), (!!vmItemReview.plan.joinRequests.length || !!vmItemReview.plan.increaseStakeRequests.length) ? 'share-requests-section' : 'social-actions');
            }
            if (vmItemReview.expired && !areAllVitalQuestionsAccepted() ) {
                var vitalQuestions = $filter('property')(vmItemReview.plan.itemGroups, 'question.vital', true);
                var unacceptedQuestion = $filter('property')(vitalQuestions, 'accepted', false)[0];
                var vendorNotAcceptedMessage = sprintf(Messages.vendorNotAccepted, {
                    supported: unacceptedQuestion.items[0].votes.length,
                    totalMembers: vmItemReview.plan.shares.length,
                    vendorName: unacceptedQuestion.items[0].name,
                    productName: vmItemReview.plan.title,
                    sharesToPass: getSharesToPass(unacceptedQuestion.items[0].votes)
                });
                addNotificationMessage(vendorNotAcceptedMessage, 'item-head-' + unacceptedQuestion.question.id);
            }

            if (!!vmItemReview.userInfo && !!vmItemReview.plan.readyToBuy
                && (vmItemReview.plan.state === States.purchasing)
                && (vmItemReview.plan.readyToBuy.votes.indexOf(vmItemReview.userInfo.id) === -1)) {
                addNotificationMessage(sprintf(Messages.voteForReadyToBuy, {
                    supportAction: 'vmItemReview.voteForReadyToBuy($index)'
                }), 'ready-to-buy-voting-head');
            }

            if ((vmItemReview.plan.state !== States.purchasing) && (vmItemReview.plan.state !== States.abandoned)) {
                if (!!vmItemReview.userInfo && isUserSharePlan() && (vmItemReview.plan.state === States.buying)) {
                    var electedTreasurer = $filter('property')(vmItemReview.plan.treasurerRequests, 'accepted', true)[0];
                    PaymentControlService.getTreasurerInfo(electedTreasurer.userId, vmItemReview.plan.id).then(function (info) {
                        vmItemReview.treasurer = info;
                        if (vmItemReview.treasurer.id === vmItemReview.userInfo.id) {
                            addNotificationMessage('You are responsible for collecting the monnies', 'payment-section');
                        }
                        if (!vmItemReview.isUserPaid()) {
                            var awaiter = (vmItemReview.treasurer.id === vmItemReview.userInfo.id) ? 'Team' : (vmItemReview.treasurer.firstName + ' ' + vmItemReview.treasurer.lastName);
                            var message = awaiter + ' awaits your payment: ' + $filter('currency')(vmItemReview.priceInfo.sharedTotalFirstYearCost);
                            addNotificationMessage(message, 'treasurer-voting-head');
                        }
                    });
                }
                vmItemReview.daysToPay = Utils.getDaysUntilNow(vmItemReview.plan.payment.expiration);
                if ((vmItemReview.daysToPay < 0) || (vmItemReview.plan.state !== States.buying)) {
                    vmItemReview.daysToPay = 0;
                }
                if (vmItemReview.plan.state === States.buying) {
                    countPaymentComplete();
                }
            }

            recalculatePrice();
            initCategoryName();
            initItemFilter();
        }

        function showPlanInfo() {
            $uibModal.open({
                templateUrl: 'itemReview/planInfoModal.html',
                controller: 'PlanInfoModalInstanceController',
                controllerAs: 'vmPlanInfo',
                resolve: {
                    info: function () {
                        return ItemReviewService.getPlanInfo(vmItemReview.plan);
                    },
                    edit: function () {
                        return isUserAbleToEditPlan();
                    },
                    categoryName: function () {
                        return vmItemReview.categoryName;
                    },
                    categoryList: function () {
                        return vmItemReview.categoryList;
                    }
                },
                backdrop: 'static'
            }).result.then(function (newPlanInfo) {
                if (!angular.equals(ItemReviewService.getPlanInfo(vmItemReview.plan), newPlanInfo)) {
                    ItemReviewService.updatePlanInfoById(vmItemReview.plan.id, newPlanInfo).then(function () {
                        if (newPlanInfo.categoryId !== vmItemReview.plan.categoryId) {
                            initQuestions();
                        }
                        angular.forEach(newPlanInfo, function (value, key) {
                            vmItemReview.plan[key] = value;
                            initCategoryName();
                            growl.addSuccessMessage(Messages.changesSaved);
                        });
                    });
                }
            });
        }

        function isAuthorSignedIn() {
            if (!vmItemReview.userInfo || !vmItemReview.plan) return false;
            return vmItemReview.userInfo.id === vmItemReview.plan.ownerId;
        }

        function isUserAbleToEditPlan() {
            return (isAuthorSignedIn() && (vmItemReview.plan.state === "PURCHASING"));
        }

        function onShareRequestClick() {
            $uibModal.open({
                templateUrl: 'itemReview/shareRequestModal.html',
                controller: 'ShareRequestModalInstanceController',
                controllerAs: 'vmShareRequest',
                resolve: {
                    openedShares: function () {
                        return vmItemReview.openedShares;
                    },
                    totalShares: function () {
                        return vmItemReview.plan.totalShares;
                    },
                    userSharesPlan: function () {
                        console.log("isUserSharePlan(): ", isUserSharePlan());
                        return isUserSharePlan();
                    }
                },
                backdrop: 'static'
            }).result.then(function (request) {
                    request.planId = vmItemReview.plan.id;
                    if (!isUserSharePlan()) {
                        ItemReviewService.sendJoinRequest(request).then(function () {
                            growl.addSuccessMessage(Messages.joinRequestSent);
                        });
                    }
                    else {
                        ItemReviewService.sendIncreaseStakeRequest(request).then(function () {
                            growl.addSuccessMessage(Messages.increaseStakeRequestSent);
                        }, function (error) {
                            console.log("error: ", error);
                        });
                    }
                });
        }

        function isUserSharePlan(userId) {
            if (!userId && !!vmItemReview.userInfo) {
                userId = vmItemReview.userInfo.id;
            }
            else {
                if (!vmItemReview.userInfo) {
                    return false;
                }
            }
            for (var i = 0; i < vmItemReview.plan.shares.length; i++) {
                if (vmItemReview.plan.shares[i].userId === userId) {
                    return true;
                }
            }
            return false;
        }

        function isUserSentShareRequest(userId) {
            if (!userId && !!vmItemReview.userInfo) {
                userId = vmItemReview.userInfo.id;
            }
            else {
                return false;
            }
            var collectionName = (!isUserSharePlan()) ? 'joinRequests' : 'increaseStakeRequests';
            for (var i = 0; i < vmItemReview.plan[collectionName].length; i++) {
                if (vmItemReview.plan[collectionName][i].userId === userId) {
                    return true;
                }
            }
            return false;
        }

        function exitPlan() {
            if ((vmItemReview.plan.state === States.buying) && (vmItemReview.treasurer.id === vmItemReview.userInfo.id)) {
                growl.addInfoMessage(Messages.preventPlanLeaving);
                return;
            }
            $uibModal.open({
                templateUrl: 'core/confirmationModal.html',
                controller: 'ConfirmationModalInstanceController',
                controllerAs: 'vmConfirmation',
                resolve: {
                    message: function () {
                        return "Are you sure you want to leave this plan's team?";
                    },
                    type: function () {
                        return ConfirmationModalTypes.warning;
                    },
                    yesNo: function () {
                        return false;
                    }
                }
            }).result.then(function () {
                    ItemReviewService.exitPlan(vmItemReview.plan.id).then(function () {
                        growl.addSuccessMessage(sprintf(Messages.planLeft, {
                            firstName: vmItemReview.userInfo.firstName,
                            lastName: vmItemReview.userInfo.lastName
                        }));
                    });
                });
        }

        function initCategoryName() {
            var selectedCategory = $filter('property')(vmItemReview.categoryList, 'id', vmItemReview.plan.categoryId)[0];
            vmItemReview.categoryName.child = selectedCategory.name;
            vmItemReview.categoryName.parent = selectedCategory.group;
        }

        function copyPlan() {
            var itemGroups = $filter('property')(vmItemReview.plan.itemGroups, 'accepted', true);
            var items = [];
            itemGroups.forEach(function (group) {
                if (group.question.planItemGroupTypeId !== "Vendor") { //TODO: too bad
                    var item = angular.copy(group.items[0]);
                    item.question = group.question.title;
                    item.typeId = group.question.planItemGroupTypeId;
                    item.selected = true;
                    items.push(item);
                }
            });
            if (!!items.length) {
                $uibModal.open({
                    templateUrl: 'itemReview/itemsSelectModal.html',
                    controller: 'ItemsSelectModalInstanceController',
                    controllerAs: 'vmItemsSelect',
                    resolve: {
                        items: function () {
                            return items;
                        },
                        types: function () {
                            if (!planItemGroupTypeList) {
                                return ItemReviewService.getPlanItemGroupTypeList().then(function (typeList) {
                                    planItemGroupTypeList = typeList;
                                    return typeList;
                                });
                            }
                            else {
                                return planItemGroupTypeList;
                            }
                        }
                    },
                    backdrop: 'static'
                }).result.then(function (selectedItems) {
                    goToPlanCreation(selectedItems);
                });
            }
            else {
                goToPlanCreation(items);
            }

            function goToPlanCreation(items) {
                ItemReviewService.copyPlan(vmItemReview.plan.id).then(function (newPlan) {
                    newPlan.items = items;
                    $state.go('home.newItem', {item: newPlan});
                }, function (error) {
                    console.log("error: ", error);
                });
            }

        }

        function addNewPlanItemGroup(question) {
            $uibModal.open({
                templateUrl: 'itemReview/planItemGroupModal.html',
                controller: 'PlanItemGroupModalInstanceController',
                controllerAs: 'vmPlanItemGroup',
                resolve: {
                    planItemGroup: function () {
                        return null;
                    },
                    types: function () {
                        if (!planItemGroupTypeList) {
                            return ItemReviewService.getPlanItemGroupTypeList().then(function (typeList) {
                                planItemGroupTypeList = typeList;
                                return typeList;
                            });
                        }
                        else {
                            return planItemGroupTypeList;
                        }
                    },
                    question: function () {
                        if (!question) {
                            return null;
                        }
                        return question;
                    },
                    questions: function () {
                        //vmItemReview.questions | unPostedQuestionList:vmItemReview.plan.itemGroups
                        return $filter('unPostedQuestionList')(vmItemReview.questions, vmItemReview.plan.itemGroups);
                    }
                },
                backdrop: 'static'
            }).result.then(function (planItemGroup) {
                if (!planItemGroup.question.id) {
                    planItemGroup.question = {
                        title: planItemGroup.question.title,
                        planItemGroupTypeId: planItemGroup.type.id,
                        categoryId: vmItemReview.plan.categoryId,
                        custom: true
                    };
                    ItemReviewService.saveQuestion(planItemGroup.question).then(function (id) {
                        planItemGroup.question.id = id;
                        savePlanItemGroup();
                    });
                }
                else {
                    savePlanItemGroup();
                }

                function savePlanItemGroup() {
                    planItemGroup.planId = vmItemReview.plan.id;
                    ItemReviewService.savePlanItemGroup(ItemReviewService.getPlanItemGroupTO(planItemGroup)).then(function (createdItemGroupObjId) {
                        growl.addSuccessMessage(Messages.questionSaved);
                        if (!!planItemGroup.item) {
                            ItemReviewService.savePlanItem(createdItemGroupObjId, planItemGroup.item).then(function () {
                                growl.addSuccessMessage(sprintf(Messages.itemSaved, {name: planItemGroup.item.name}));
                            });
                        }
                    });
                }
            });
        }

        function saveOrUpdateItem(planItemGroup, item) {
            $uibModal.open({
                templateUrl: 'itemReview/alternativeModal.html',
                controller: 'AlternativeModalInstanceController',
                controllerAs: 'vmAlternative',
                resolve: {
                    item: function () {
                        if (!item) return null;
                        return angular.copy(item);
                    },
                    type: function () {
                        if (!planItemGroupTypeList) {
                            return ItemReviewService.getPlanItemGroupTypeList().then(function (typeList) {
                                planItemGroupTypeList = typeList;
                                return $filter('property')(typeList, 'id', planItemGroup.question.planItemGroupTypeId)[0];
                            });
                        }
                        else {
                            return $filter('property')(planItemGroupTypeList, 'id', planItemGroup.question.planItemGroupTypeId)[0];
                        }
                    },
                    firstItem: function () {
                        return !planItemGroup.items.length;
                    }
                },
                backdrop: 'static'
            }).result.then(function (returnedItem) {
                if (!returnedItem.objId) {
                    ItemReviewService.savePlanItem(planItemGroup.question.objId, returnedItem).then(function () {
                        growl.addSuccessMessage(sprintf(Messages.itemSaved, {name: returnedItem.name}));
                    });
                }
                else {
                    ItemReviewService.editPlanItem(returnedItem).then(function () {
                        growl.addSuccessMessage(sprintf(Messages.itemUpdated, {name: returnedItem.name}));
                    });
                }
            });
        }

        function addRejection(planItemGroup) {
            $uibModal.open({
                templateUrl: 'itemReview/scrapModal.html',
                controller: 'ScrapModalInstanceController',
                controllerAs: 'vmScrap',
                backdrop: 'static'
            }).result.then(function (scrapInfo) {
                scrapInfo.objId = planItemGroup.question.objId;
                ItemReviewService.addRejection(scrapInfo).then(function () {
                    growl.addSuccessMessage(Messages.scrapSaved);
                });
            });
        }

        function sortItems(items) {
            return $filter('orderBy')(items, ['-accepted', 'reoccurringPrice', '-price', '-votes']);
        }

        function isIncreasingStakeAvailable() {
            return (!!vmItemReview.userInfo
            && !!vmItemReview.openedShares
            && isUserSharePlan()
            && !isUserSentShareRequest()
            && (vmItemReview.plan.totalShares > 2)
            && !((vmItemReview.plan.shares.length === 1) && (vmItemReview.openedShares === 1)));
        }

        function onSendEmailClick() {
            $uibModal.open({
                templateUrl: 'itemReview/sendEmailModal.html',
                controller: 'SendEmailModalInstanceController',
                controllerAs: 'vmSendEmail',
                resolve: {
                    planId: function () {
                        return vmItemReview.plan.id;
                    },
                    planImageUrl: function () {
                        return ImageService.getPlanImageById(vmItemReview.plan.id, 1, Sizes.large, true);
                    },
                    productName: function () {
                        return vmItemReview.plan.title;
                    }
                },
                backdrop: 'static'
            }).result.then(function () {
                growl.addSuccessMessage(Messages.mailSent);
            });
        }

        function publishToFacebook() {
            //var planUrl = 'http://t2o.intricity.com/' + $state.href('home.itemReview', {id: vmItemReview.plan.id});
            var planUrl = $state.href('home.itemReview', {id: vmItemReview.plan.id}, {absolute: true});
            SocialSharingService.sharePlanOnFacebook(planUrl, vmItemReview.plan.title, vmItemReview.planImageUrl, vmItemReview.priceInfo.sharedTotalUpfrontCost, vmItemReview.openedShares, isUserSharePlan());
        }

        function becomeATreasurer() {
            $uibModal.open({
                templateUrl: 'itemReview/candidacyRequestModal.html',
                controller: 'CandidacyRequestModalInstanceController',
                controllerAs: 'vmCandidacyRequest',
                resolve: {
                    candidacyList: function () {
                        var list = [];
                        vmItemReview.plan.shares.forEach(function (participant) {
                            if (!($filter('property')(vmItemReview.plan.treasurerRequests, 'userId', participant.userId).length)) {
                                list.push(participant);
                            }
                        });
                        return angular.copy(list);
                    }
                },
                backdrop: 'static'
            }).result.then(function (request) {
                request.planId = vmItemReview.plan.id;
                ItemReviewService.sendTreasurerRequest(request).then(function () {
                    var candidate = $filter('property')(vmItemReview.plan.shares, 'userId', request.userId)[0];
                    growl.addSuccessMessage(sprintf(Messages.treasurerRequestSent, {
                        userName: candidate.firstName + " " + candidate.lastName
                    }));
                });
            });
        }

        function isTreasurerSelected() {
            return !!vmItemReview.plan.treasurerRequests.length &&
                (((vmItemReview.plan.treasurerRequests.length === 1) && vmItemReview.plan.treasurerRequests[0].accepted) ||
                (((vmItemReview.plan.treasurerRequests.length > 1) && vmItemReview.plan.treasurerRequests[0].accepted && !vmItemReview.plan.treasurerRequests[1].accepted)));
        }

        function isUserPaid(userId) {
            if ((vmItemReview.plan.state !== States.buying) || !vmItemReview.plan.payment) {
                return false;
            }
            if (!userId && !!vmItemReview.userInfo) {
                userId = vmItemReview.userInfo.id;
            }
            else {
                if (!vmItemReview.userInfo) {
                    return false;
                }
            }
            return !!$filter('property')(vmItemReview.plan.payment.paid, 'userId', userId).length;
        }

        function markUserAsPaid(userId) {
            $uibModal.open({
                templateUrl: 'core/confirmationModal.html',
                controller: 'ConfirmationModalInstanceController',
                controllerAs: 'vmConfirmation',
                resolve: {
                    message: function () {
                        return "Confirm receiving the money?";
                    },
                    type: function () {
                        return ConfirmationModalTypes.warning;
                    },
                    yesNo: function () {
                        return false;
                    }
                }
            }).result.then(function () {
                var paymentInfo = {
                    planId: vmItemReview.plan.id,
                    userId: userId
                };
                PaymentControlService.markUserAsPaid(paymentInfo).then(function () {
                    growl.addSuccessMessage(Messages.paidUserMarked);
                });
            });
        }

        function areAllVitalQuestionsAccepted() {
            var vitalItemGroups = $filter('property')(vmItemReview.plan.itemGroups, 'question.vital', true);
            for (var i = 0; i < vitalItemGroups.length; i++) {
                if (!vitalItemGroups[i].accepted) {
                    return false;
                }
            }
            return true;
        }

        function showChat(itemGroup, objId, viewId) {
            ChatService.getChatTreeForPlanObject(objId).then(function (chatTree) {
                itemGroup.chatTree = chatTree;
                itemGroup.showChatArea = true;
                $timeout(function () {
                    ScrollTo.idOrName('plan-chat-' + viewId);
                });
            });
        }

        function countPaymentComplete() {
            var sharesPaid = 0;
            vmItemReview.plan.payment.paid.forEach(function (payment) {
                sharesPaid += ($filter('property')(vmItemReview.plan.shares, 'userId', payment.userId)[0]).shares;
            });
            vmItemReview.paymentComplete = sharesPaid * 100 / vmItemReview.joinedShares;
        }

        function addNotificationMessage(message, id) {
            for (var i = 0; i < vmItemReview.planNotificationMessages.length; i++) {
                if (vmItemReview.planNotificationMessages[i].message === message) {
                    return;
                }
            }
            vmItemReview.planNotificationMessages.push({
                message: message,
                idToScrollTo: id
            });
        }

        function onNotificationMessageClick(notificationMessage) {
            ScrollTo.idOrName(notificationMessage.idToScrollTo);
        }

        function onVotingFilterClick($event) {
            $event.preventDefault();
            $event.stopPropagation();
            var dropdownMenu = angular.element('#voting-filter-dropdown-menu');
            dropdownMenu.slideToggle(100);
            vmItemReview.itemFilter.expanded = !vmItemReview.itemFilter.expanded;
        }

        function isQuestionHidden(accepted) {
            return ((vmItemReview.itemFilter.selected.identity === 'PASSED_VOTES') && !accepted)
                || ((vmItemReview.itemFilter.selected.identity === 'PENDING_VOTES') && !!accepted);
        }

        function getSharesToPass(votes) {
            var totalShared = 0;
            var favor = 0;
            angular.forEach(vmItemReview.plan.shares, function (participant) {
                totalShared += participant.shares;
                if (votes.indexOf(participant.userId) !== -1) {
                    favor += participant.shares;
                }
            });
            var toPass = Math.ceil(vmItemReview.plan.numberToAgree * totalShared / vmItemReview.plan.totalShares - favor);
            if (toPass < 0) {
                toPass = 0;
            }
            return toPass;
        }

        function voteForReadyToBuy(notificationMessageIndex) {
            if (vmItemReview.plan.readyToBuy.votes.indexOf(vmItemReview.userInfo.id) !== -1) {
                if (!angular.isUndefined(notificationMessageIndex)) {
                    vmItemReview.planNotificationMessages.splice(notificationMessageIndex, 1);
                }
                return;
            }
            if (!isVoteFinal(vmItemReview.plan.readyToBuy)) {
                ItemReviewService.voteForPlanObject(vmItemReview.plan.readyToBuy.objId).then(function () {
                    if (!angular.isUndefined(notificationMessageIndex)) {
                        vmItemReview.planNotificationMessages.splice(notificationMessageIndex, 1);
                    }
                });
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
                    ItemReviewService.voteForPlanObject(vmItemReview.plan.readyToBuy.objId).then(function () {
                        if (!angular.isUndefined(notificationMessageIndex)) {
                            vmItemReview.planNotificationMessages.splice(notificationMessageIndex, 1);
                        }
                    });
                });
            }
        }

        function isVoteFinal(item) {
            var upcomingVote = 0;
            var totalShared = 0;
            var voted = 0;
            vmItemReview.plan.shares.forEach(function (participant) {
                totalShared += participant.shares;
                if (vmItemReview.userInfo.id === participant.userId) {
                    upcomingVote = participant.shares;
                }
            });
            item.votes.forEach(function (votedId) {
                voted += getSharesById(votedId);
            });
            console.log("agreement: ", vmItemReview.plan.numberToAgree / vmItemReview.plan.totalShares * 100);
            console.log("count: ", (voted + upcomingVote) / totalShared * 100);
            return (vmItemReview.plan.numberToAgree / vmItemReview.plan.totalShares) <= ((voted + upcomingVote) / totalShared);
        }

        function getSharesById(id) {
            for (var i = 0; i < vmItemReview.plan.shares.length; i++) {
                if (vmItemReview.plan.shares[i].userId === id) {
                    return vmItemReview.plan.shares[i].shares;
                }
            }
            return 0;
        }

        function onImageClick(image, edit) {
            if (!!image && !edit) {
                vmItemReview.mainImageNumber = image.number;
                vmItemReview.planImageUrl = ImageService.getPlanImageById(vmItemReview.plan.id, image.number, Sizes.large, true);
            }
            else {
                if (isUserAbleToEditPlan()) {
                    $uibModal.open({
                        templateUrl: 'core/planImageModal.html',
                        controller: 'PlanImageModalInstanceController',
                        controllerAs: 'vmPlanImage',
                        resolve: {
                            planId: function () {
                                return vmItemReview.plan.id;
                            },
                            number: function () {
                                if (!image && !!edit) {
                                    return vmItemReview.mainImageNumber;
                                }
                                return (!edit ? (vmItemReview.plan.imagesCount + 1) : image.number);
                            },
                            edit: function () {
                                return !!edit;
                            }
                        },
                        backdrop: 'static'
                    }).result.then(function (removed) {
                        if (!!removed) {
                            ImageService.removeImage(vmItemReview.plan.id, image.number).then(function () {
                                var imageIndex = vmItemReview.planImages.indexOf(image);
                                vmItemReview.planImages.splice(imageIndex, 1);
                                var newLength = vmItemReview.planImages.length;
                                vmItemReview.planImages = [];
                                for (var i = 0; i < newLength; i++) {
                                    vmItemReview.planImages.push({
                                        number: i + 1,
                                        url: ImageService.getPlanImageById(vmItemReview.plan.id, i + 1, Sizes.small, true)
                                    });
                                }
                                vmItemReview.mainImageNumber = 1;
                                vmItemReview.planImageUrl = ImageService.getPlanImageById(vmItemReview.plan.id, vmItemReview.mainImageNumber, Sizes.large, true);
                            });
                            return;
                        }
                        if (!image) {
                            vmItemReview.plan.imagesCount++;
                            vmItemReview.planImages.push({
                                number: vmItemReview.plan.imagesCount,
                                url: ImageService.getPlanImageById(vmItemReview.plan.id, vmItemReview.plan.imagesCount, Sizes.small, true)
                            });
                        }
                        else {
                            image.url = ImageService.getPlanImageById(vmItemReview.plan.id, image.number, Sizes.small, true);
                            if (iamge.number === 1) {
                                vmItemReview.mainImageNumber = 1;
                                vmItemReview.planImageUrl = ImageService.getPlanImageById(vmItemReview.plan.id, vmItemReview.mainImageNumber, Sizes.large, true);
                            }
                        }
                    });
                }
            }
        }

        function slideImage(back) {
            if (!back) {
                vmItemReview.mainImageNumber++;
            }
            else {
                vmItemReview.mainImageNumber--;
            }
            vmItemReview.planImageUrl = ImageService.getPlanImageById(vmItemReview.plan.id, vmItemReview.mainImageNumber, Sizes.large, true);
        }

        function getPlanOwnerInfo() {
            for (var i = 0; i < vmItemReview.plan.shares.length; i++) {
                if (vmItemReview.plan.shares[i].userId === vmItemReview.plan.ownerId) {
                    return vmItemReview.plan.shares[i];
                }
            }
            return null;
        }

    }

})();