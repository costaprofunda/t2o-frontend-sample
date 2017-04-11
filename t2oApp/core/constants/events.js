/**
 * Created by cpro on 25.10.15.
 */

(function () {
    'use strict';

    angular.module('t2oFrontendCore')
        .constant('Events', {

            //---------inner----------

            unauthorized: 'UNAUTHORIZED',
            loaderShow: 'LOADER_SHOW',
            loaderHide: 'LOADER_HIDE',
            logout: 'LOGOUT',
            planAdded: 'PLAN_ADDED',
            locationUpdated: 'LOCATION_UPDATED',

            //------form Backend------

            joinRequest: 'JOIN_REQUEST',
            joinRequestVote: 'JOIN_REQUEST_VOTE',
            joinRequestUnVote: 'JOIN_REQUEST_UNVOTE',
            joinRequestAccepted: 'JOIN_REQUEST_ACCEPT',

            increaseStakeRequest: 'INCREASE_STAKE_REQUEST',
            increaseStakeRequestVote: 'INCREASE_STAKE_REQUEST_VOTE',
            increaseStakeRequestUnVote: 'INCREASE_STAKE_REQUEST_UNVOTE',
            increaseStakeRequestAccepted: 'INCREASE_STAKE_REQUEST_ACCEPT',

            exitPlan: 'EXIT_PLAN',
            planAbandoned: 'ABANDON_PLAN',

            planItemGroupAdded: 'PLAN_ITEM_GROUP',
            planItemGroupAccepted: 'PLAN_ITEM_GROUP_ACCEPT',

            planItemAdded: 'PLAN_ITEM',
            planItemUpdated: 'PLAN_ITEM_UPDATE',
            planItemVote: 'PLAN_ITEM_VOTE',
            planItemUnVote: 'PLAN_ITEM_UNVOTE',

            scrapPlanItemGroup: 'SCRAP',
            scrapVote: 'SCRAP_VOTE',
            scrapUnVote: 'SCRAP_UNVOTE',
            scrapAccepted: 'SCRAP_ACCEPT',

            treasurerRequest: 'TREASURER_REQUEST',
            treasurerRequestVote: 'TREASURER_REQUEST_VOTE',
            treasurerRequestUnVote: 'TREASURER_REQUEST_UNVOTE',
            treasurerRequestAccepted: 'TREASURER_REQUEST_ACCEPT',

            markUserAsPaid: 'MARK_USER_AS_PAID',
            kickUnpaidUsers: 'KICK_UNPAID_USERS',

            chatMessageAdded: 'CHAT_MESSAGE_ADD',
            chatMessageUpdated: 'CHAT_MESSAGE_UPDATE',
            chatMessageDeleted: 'CHAT_MESSAGE_DELETE',

            planStatusChanged: 'PLAN_STATUS_CHANGE',

            readyToBuyVote: 'READY_TO_BUY_VOTE',
            readyToBuyUnVote: 'READY_TO_BUY_UNVOTE',
            readyToBuyAdded: 'READY_TO_BUY_ADD',
            readyToBuyRemoved: 'READY_TO_BUY_REMOVE',
            readyToBuyAccepted: 'READY_TO_BUY_ACCEPT',
            
            notifaction: 'NOTIFICATION'
        });
})();
