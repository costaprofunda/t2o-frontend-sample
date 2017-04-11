/**
 * Created by cpro on 18.02.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('sharesToPass', sharesToPass);

    sharesToPass.$inject = [];

    function sharesToPass() {
        return {
            restrict: 'EA',
            replace: true,
            template: '<span>' +
                          '<span ng-show="!!toPass" ng-bind="toPass"></span>' +
                          '<span ng-switch="toPass">' +
                            '<span ng-switch-when="0">Passed</span>' +
                            '<span ng-switch-when="1"> Share To Pass</span>' +
                            '<span ng-switch-default> Shares To Pass</span>' +
                          '</span>' +
                      '</span>',
            scope: {
                participants: '=?',
                votes: '=?',
                favor: '=?',
                toPass: '=?',
                numberToAgree: '@',
                totalShares: '@'
            },
            link: function (scope) {
                if (!!scope.votes) {
                    processVotes();
                }
                else {
                    scope.favor = 0;
                    scope.toPass = 0;
                }
                scope.$watchCollection('votes', function (newVal, oldVal) {
                    if (!!newVal && !angular.equals(newVal, oldVal)) {
                        processVotes();
                    }
                });

                function processVotes() {
                    var totalShared = 0;
                    scope.favor = 0;
                    angular.forEach(scope.participants, function (participant) {
                        totalShared += participant.shares;
                        if (scope.votes.indexOf(participant.userId) !== -1) {
                            scope.favor += participant.shares;
                        }
                    });
                    scope.toPass = Math.ceil(scope.numberToAgree * totalShared / scope.totalShares - scope.favor);
                    if (scope.toPass < 0) {
                        scope.toPass = 0;
                    }
                }
            }
        };
    }

})();