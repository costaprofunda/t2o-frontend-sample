/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendApp')
        .run(run);

    run.$inject = ['$rootScope', '$state', '$templateCache', 'Params', 'SecurityService', 'ReturnLocationStorageService', 'Env'];

    function run($rootScope, $state, $templateCache, Params, SecurityService, ReturnLocationStorageService, Env) {

        var preventPreLoginStateSave = false;

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            //console.log("fromState: ", fromState);
            //console.log("fromParams: ", fromParams);
            //console.log("toState: ", toState);
            //console.log("toParams: ", toParams);
            if (fromState.name === 'home.login') {
                preventPreLoginStateSave = false;
            }
            if ((Params.securedStates.indexOf(toState.name) !== -1) && !SecurityService.isAuthorized()) {
                ReturnLocationStorageService.setStateName(toState.name);
                ReturnLocationStorageService.setParams(toParams);
                event.preventDefault();
                preventPreLoginStateSave = true;
                $state.go('home.login');
            }
            if ((toState.name === 'home.login') && !preventPreLoginStateSave) {
                ReturnLocationStorageService.setStateName(fromState.name);
                ReturnLocationStorageService.setParams(fromParams);
            }
            if (toState.name === 'home') {
                event.preventDefault();
                $state.go('home.itemList');
            }
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log("error: ", error);
            event.preventDefault();
        });

        $rootScope.$on('$viewContentLoaded', function () {
            var version = SecurityService.getVersion();
            if ((!version || (version != Env.version)) && !!Env.templates) {
                SecurityService.setVersion(Env.version);
                Env.templates.forEach(function (template) {
                    return $templateCache.remove(template);
                });
            }
        });

    }

})();