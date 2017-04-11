/**
 * Created by cpro on 28.12.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('planItemGroupOrder', planItemGroupOrder);

    planItemGroupOrder.$inject = [];

    function planItemGroupOrder() {

        return function (groups) {
            return groups.sort(function (a, b) {
                if (a.question.vital || (!!a.items.length && !b.items.length)) {
                    return -1;
                }
                if (b.question.vital || (!a.items.length && !!b.items.length)) {
                    return 1;
                }
                if (!a.items.length && !b.items.length) {
                    return 0;
                }
                if (!!a.items[0].price && !b.items[0].price) {
                    return -1;
                }
                if (!a.items[0].price && !!b.items[0].price) {
                    return 1;
                }
                if (!a.items[0].reoccurringPrice && !!b.items[0].reoccurringPrice) {
                    return -1;
                }
                if (!!a.items[0].reoccurringPrice && !b.items[0].reoccurringPrice) {
                    return 1;
                }
                if (a.items[0].price > b.items[0].price) {
                    return -1;
                }
                if (a.items[0].price < b.items[0].price) {
                    return 1;
                }
                return 0;
            });
        }

    }

})();