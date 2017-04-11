/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendApp')
        .config(config);

    config.$inject = [
        '$locationProvider',
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        'RestangularProvider',
        'growlProvider',
        'ngScrollToOptionsProvider',
        'FacebookProvider',
        'Params',
        'Env'
    ];

    function config($locationProvider,
                    $stateProvider,
                    $urlRouterProvider,
                    $httpProvider,
                    RestangularProvider,
                    growlProvider,
                    ngScrollToOptionsProvider,
                    FacebookProvider,
                    Params,
                    Env) {

        //$locationProvider.html5Mode(true).hashPrefix('!');
        //$locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/');

        $stateProvider

            .state('home', {
                url: '/',
                views: {
                    '': {
                        templateUrl: 'core/main.html',
                        controller: 'MainController',
                        controllerAs: 'vmMain'
                    },
                    'advertisingPane@home': {
                        templateUrl: 'core/advertisingPane.html'
                    }
                },
                resolve: {
                    categoryTree: ['CategoryService', function (CategoryService) {
                        return CategoryService.getCategoryTree().then(function (tree) {
                            return tree;
                        }, function () {
                            return null;
                        });
                    }]
                }
            })

            .state('home.login', {
                url: 'login',
                controller: 'LoginController'
            })

            .state('home.signUp', {
                url: 'sign-up',
                controller: 'SignUpController'
            })

            .state('home.404', {
                url: '',
                template: '<h1 align="center" class="error-div">404</h1>'
            })

            .state('home.itemList', {
                url: 'items',
                templateUrl: 'items/list.html',
                controller: 'ItemListController',
                controllerAs: 'vmItemList',
                params: {
                    categoryId: null,
                    searchKeyword: ''
                }
            })

            .state('home.newItem', {
                url: 'new-item',
                templateUrl: 'newItem/newItem.html',
                controller: 'NewItemController',
                controllerAs: 'vmNewItem',
                params: {
                    item: null
                }
            })

            .state('home.itemReview', {
                url: 'item-review/{id}',
                templateUrl: 'itemReview/itemReview.html',
                controller: 'ItemReviewController',
                controllerAs: 'vmItemReview',
                resolve: {
                    plan: ['$state', '$stateParams', 'ItemReviewService', function ($state, $stateParams, ItemReviewService) {
                        return ItemReviewService.getPlanById($stateParams.id).then(function (plan) {
                            return plan;
                        }, function () {
                            $state.go('home.itemNotFound');
                        });
                    }]
                }
            })

            .state('home.userProfile', {
                url: 'user-profile/{id}',
                templateUrl: 'userProfile/userProfile.html',
                controller: 'UserProfileController',
                controllerAs: 'vmUserProfile',
                resolve: {
                    contactInfo: ['$state', '$stateParams', 'UserProfileService', function ($state, $stateParams, UserProfileService) {
                        return UserProfileService.getContactInformation($stateParams.id).then(function (info) {
                            return info;
                        }, function () {
                            $state.go('home.userNotFound');
                        });
                    }]
                }
            })

            .state('home.notifications', {
                url: 'notifications',
                templateUrl: 'notifications/notifications.html',
                controller: 'NotificationsController',
                controllerAs: 'vmNotifications'
            })

            .state('home.userNotFound', {
                url: 'user-not-found',
                template: '<div class="error-div">User profile has not been found</div>'
            })

            .state('home.itemNotFound', {
                url: 'item-not-found',
                template: '<div class="error-div">Requested plan has not been found</div>'
            });

        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
        $httpProvider.interceptors.push('HttpInterceptor');

        RestangularProvider.setBaseUrl(Env.apiUrl);
        RestangularProvider.setResponseInterceptor(function (response) {
            if ((response.result.status === 200) && !!response.data) {
                return response.data;
            }
        });

        growlProvider.globalTimeToLive(Params.messagesTimeToLive);
        growlProvider.globalEnableHtml(true);

        ngScrollToOptionsProvider.extend({
            handler: function (el) {
                $(el).scrollIntoView();
            }
        });

        FacebookProvider.init({appId: Params.facebookAppId, version: 'v2.2'});
    }

})();