/**
 * Created by cpro on 06.09.15.
 */

(function () {
    'use strict';

    angular.module('t2oFrontendCore')
        .constant('Params', {
            authCookieName: 'T2O-TOKEN',
            messagesTimeToLive: 8000,
            securedStates: ['home.newItem', 'home.userProfile', 'home.notifications'],
            wsRelaunchErrorCodes: [1001, 1006],
            secondsToRestartWebSocket: 5,
            milliSecondsBeforeLoaderShow: 400,
            secondsToWaitAfterSignUp: 6,
            facebookAppId: 'noFacebookAppForAWhile',
            userRatingMaxStars: 5,
            parsedSites: ["://www.amazon.com"],
            notificationsDropdownItemsCount: 5
        });
})();
