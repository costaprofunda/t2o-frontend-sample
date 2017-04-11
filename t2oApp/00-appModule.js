/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    //--app native modules--
    var modules = [
        't2oFrontendCore',
        't2oFrontendSecurity',
        't2oFrontendFilters',
        't2oFrontendDirectives',
        't2oFrontendItems',
        't2oFrontendNewItem',
        't2oFrontendItemReview',
        't2oFrontendUserProfile',
        't2oFrontendNotifications'
    ];

    modules.forEach(function (module) {
        angular.module(module, []);
    });

    //--3rd party modules--
    modules.push('ui.router');
    modules.push('ui.bootstrap');
    modules.push('ngCookies');
    modules.push('restangular');
    modules.push('angular-growl');
    modules.push('localytics.directives');
    modules.push('angularFileUpload');
    modules.push('angular-websocket');
    modules.push('ngScrollTo');
    modules.push('ngTagsInput');
    modules.push('facebook');
    modules.push('ngSanitize');
    modules.push('sprintf');
    modules.push('monospaced.elastic');
    modules.push('angular-bind-html-compile');
    modules.push('leaflet-directive');
    modules.push('ngAnimate');

    angular.module('t2oFrontendApp', modules);

})();