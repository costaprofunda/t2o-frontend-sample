/**
 * Created by cpro on 22.11.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendItemReview')
        .service('SocialSharingService', SocialSharingService);

    SocialSharingService.$inject = ['Facebook', 'growl', 'Messages'];

    function SocialSharingService(Facebook, growl, Messages) {

        this.sharePlanOnFacebook = sharePlanOnFacebook;

        function sharePlanOnFacebook(planUrl, planTitle, planImageUrl, costPerShare, openedShares, planMember) {
            var description = "I've joined a purchasing team to buy " + planTitle + ". The cost per share is $" + costPerShare + ". If anybody is interested there are " + openedShares + "available.";
            if (!planMember) {
                description = "I found this purchasing plan on team2own, and I thought you might be interested in it.";
            }
            Facebook.ui({
                method: 'feed',
                link: planUrl,
                caption: planTitle,
                picture: planImageUrl,
                description: description
            }, function (response) {
                if (!!response && !!response.post_id) {
                    growl.addSuccessMessage(sprintf(Messages.postPublished, {link: "<a href='http://www.facebook.com/" + response.post_id + "' target='_blank'>View</a>"}));
                }
            });
        }

    }

})();