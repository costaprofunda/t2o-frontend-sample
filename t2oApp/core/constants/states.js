/**
 * Created by cpro on 04.12.15.
 */

(function () {
    'use strict';

    angular.module('t2oFrontendCore')
        .constant('States', {
            abandoned: 'ABANDONED',
            purchasing: 'PURCHASING',
            voting: 'VOTING',
            buying: 'BUYING',
            readyToBuy: 'READY_TO_BUY',
            closed: 'CLOSED'
        });
})();