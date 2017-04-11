/**
 * Created by cpro on 19.02.16.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('planCandidateItemsOrder', planCandidateItemsOrder);

    planCandidateItemsOrder.$inject = ['$filter'];

    function planCandidateItemsOrder($filter) {

        return function (items, shares) {
            return items.sort(function (a, b) {
                var votedForA = 0;
                var votedForB = 0;
                a.votes.forEach(function (vote) {
                    var sharesInfoA = $filter('property')(shares, 'userId', vote)[0];
                    if (angular.isDefined(sharesInfoA)) {
                        votedForA += sharesInfoA.shares;
                    }

                });
                b.votes.forEach(function (vote) {
                    var sharesInfoB = $filter('property')(shares, 'userId', vote)[0];
                    if (angular.isDefined(sharesInfoB)) {
                        votedForB += sharesInfoB.shares;
                    }
                });
                if (votedForA > votedForB) {
                    return -1;
                }
                if (votedForA < votedForB) {
                    return 1;
                }
                return 0;
            });
        }

    }

})();