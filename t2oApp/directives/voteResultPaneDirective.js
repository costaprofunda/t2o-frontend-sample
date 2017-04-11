/**
 * Created by cpro on 16.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('voteResultPane', voteResultPane);

    voteResultPane.$inject = [];

    function voteResultPane() {
        return {
            restrict: 'E',
            //require: '^planItem',
            replace: true,
            templateUrl: 'directives/voteResultPane.html',
            scope: {
                participants: '=?',
                votes: '=?',
                favor: '=?',
                toPass: '=?',
                altNumber: '=?',
                tie: '=?',
                numberToAgree: '@',
                totalShares: '@',
                shortcut: '@',
                mirrored: '@'
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
                        if (scope.votes.indexOf(participant.userId) >= 0) {
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