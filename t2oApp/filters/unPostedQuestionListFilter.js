/**
 * Created by cpro on 11.11.15.
 */

(function () {

    angular
        .module('t2oFrontendFilters')
        .filter('unPostedQuestionList', unPostedQuestionList);

    unPostedQuestionList.$inject = ['$filter'];

    function unPostedQuestionList($filter) {

        return function (questionCollection, itemGroups) {
            var resultArray = [];
            questionCollection.forEach(function (question) {
                if (!($filter('property')(itemGroups, 'question.title', question.title)).length) {
                    resultArray.push(question);
                }
            });
            return resultArray;
        }

    }

})();