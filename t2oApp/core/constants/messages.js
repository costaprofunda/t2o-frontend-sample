/**
 * Created by cpro on 09.02.16.
 */

(function () {
    'use strict';

    angular.module('t2oFrontendCore')
        .constant('Messages', {
            //Growl
            unableToVote: "We'll check with %(userName) to see if He/She is willing to join. He/She requested %(sharesRequested)s shares, and there are only %(sharesRemained)s remaining",
            itemScrapped: "\"%(questionName)s\" has been scrapped",
            planProlonged: "Your team's plan has been prolonged for a week",
            teamVotedForBuying: "Hurray! Your team has voted to buy!",
            changesSaved: "We've saved your changes",
            joinRequestSent: "Your request to join this team has been submitted",
            increaseStakeRequestSent: "Your request to own more shares has been submitted",
            planLeft: "%(firstName)s %(lastName)s has left the team",
            questionSaved: "You have posted a new question",
            itemSaved: "\"%(name)s\" item has been added to plan",
            itemUpdated: "Your edits have been saved",
            scrapSaved: "You have proposed to scrap this question",
            mailSent: "Your email has been sent",
            treasurerRequestSent: "We've sent %(userName)s your request to make him/her a treasurer",
            paidUserMarked: "Marked",
            postPublished: "Post has been published. %(link)s",
            planSaved: "Your purchasing plan is now live!",
            registered: "Welcome! You've registered successfully",
            userInfoSaved: "Contact info saved",
            passwordSaved: "You've successfully changed your password",
            reviewSaved: "Your review has been posted",
            reviewUpdated: "Your review edits have been made",
            reviewDeleted: "Your review has been deleted",
            preventPlanLeaving: "You are responsible for collecting the money and not able to leave at this stage",
            //Confirmation Modals
            addToTeam: "This will add %(name)s to your team",
            goToBuying: "Congratulations, you are the final vote to start the purchase process!",
            notifyBeforeUnvoteVendor: "A seller of the main item is required for closing your plan, are you sure you want to remove your support for %(name)s?",
            notifyBeforeUnvoteTreasurer: "A money collector is required for closing your plan, are you sure you want to remove your support for %(name)s?",
            vendorNotAccepted: "Only %(supported)s out of %(totalMembers)s team members support %(vendorName)s as the seller of the %(productName)s. To close the plan, at least %(sharesToPass)s more shares will need to support a seller",
            treasurerNotAccepted: "Only %(supported)s out of %(totalMembers)s team members support %(collectorName)s as the money collector. To close the plan, at least %(sharesToPass)s more shares will need to support a money collector",
            treasurerNotAcceptedAlternative: "To close the plan, someone needs to be supported as a money collector",
            planHasOpenShares: 'Your plan still has open shares. To close you will need to fill them. You can <a href="javascript:;" ng-click="%(increaseStakeAction)s">increase your stake</a> or you can <a href="javascript:;" ng-click="%(inviteAction)s">invite more friends</a> to join',
            voteForReadyToBuy: 'You have enough share holders! Your plan is ready to buy, are you ready? <a href="javascript:;" ng-click="%(supportAction)s">Support</a>'
        });
})();

