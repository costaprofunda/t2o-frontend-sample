/**
 * Created by cpro on 29.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .service('ReturnLocationStorageService', ReturnLocationStorageService);

    function ReturnLocationStorageService() {

        var returnParams = null;
        var returnStateName = 'home';

        this.setStateName = setStateName;
        this.getStateName = getStateName;
        this.setParams = setParams;
        this.getParams = getParams;

        function setStateName(returnStateGot) {
            console.log("returnStateGot: ", returnStateGot);
            returnStateName = returnStateGot;
        }

        function getStateName() {
            console.log("returnStateName: ", returnStateName);
            return returnStateName || 'home';
        }

        function setParams(returnStateParams) {
            returnParams = angular.toJson(returnStateParams);
        }

        function getParams() {
            return angular.fromJson(returnParams);
        }

    }

})();