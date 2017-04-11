/**
 * Created by cpro on 04.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .controller('MainController', MainController);

    MainController.$inject = ['$rootScope', '$state', '$window', '$filter', '$timeout', '$uibModal', 'growl', 'Params', 'Sizes', 'Events', 'SecurityService', 'WebSocketService', 'CategoryService', 'ImageService', 'UserNotificationService', 'categoryTree'];

    function MainController($rootScope, $state, $window, $filter, $timeout, $uibModal, growl, Params, Sizes, Events, SecurityService, WebSocketService, CategoryService, ImageService, UserNotificationService, categoryTree) {
        var vmMain = this;

        vmMain.showLoader = false;
        vmMain.showSignComponents = false;
        // vmMain.isAuthorized = false;
        vmMain.userInfo = null;
        vmMain.categoryTree = [];
        vmMain.categoryList = [];
        vmMain.searchKeyword = '';
        vmMain.categoriesShowed = false;
        vmMain.searchShowed = false;
        vmMain.selectedCategoryIndex = -1;
        vmMain.adminPageLink = SecurityService.getLinkToAdminPage();
        vmMain.notifications = {
            unreadCount: null,
            items: [],
            opened: false
        };

        vmMain.signOut = signOut;
        vmMain.changeUser = changeUser;
        vmMain.searchByKeyword = searchByKeyword;
        vmMain.onCategoriesShow = onCategoriesShow;
        vmMain.onCategoriesMenuMouseLeave = onCategoriesMenuMouseLeave;
        vmMain.onParentCategoryClick = onParentCategoryClick;
        vmMain.onSearchShow = onSearchShow;
        vmMain.onNotificationsClick = onNotificationsClick;
        vmMain.markNotificationAsRead = markNotificationAsRead;

        $rootScope.$on(Events.planAdded, function (event, categoryId) {
            var category = $filter('property')(vmMain.categoryList, 'id', categoryId)[0];
            var parentCategory = $filter('property')(vmMain.categoryTree, 'id', category.parentId)[0];
            category.count++;
            parentCategory.count++;
        });

        $rootScope.$on(Events.loaderShow, function () {
            //console.log("loaderShow");
            vmMain.showLoader = true;
        });

        $rootScope.$on(Events.loaderHide, function () {
            //console.log("loaderHide");
            vmMain.showLoader = false;
        });

        $rootScope.$on(Events.unauthorized, function () {
            clearUserInfo();
        });

        $rootScope.$on(Events.notifaction, function (event, data) {
            if (!!vmMain.userInfo) {
                angular.forEach(data.ids, function (notificationId, userId) {
                    if (vmMain.userInfo.id === userId) {
                        vmMain.notifications.unreadCount++;
                        if (!!vmMain.notifications.items.length) {
                            if (vmMain.notifications.items.length === Params.notificationsDropdownItemsCount) {
                                vmMain.notifications.items = $filter('orderBy')(vmMain.notifications.items, 'read');
                                vmMain.notifications.items.splice(vmMain.notifications.items.length - 1, 1);
                            }
                            vmMain.notifications.items.push({id: notificationId, message: data.message, read: false});
                        }
                    }
                });
            }
        });

        var footerHeight = angular.element(document.getElementById('footer')).height();

        angular.element(document.getElementById('content')).css('min-height', $window.innerHeight - footerHeight);

        SecurityService.isSessionAlive().then(function (alive) {
            if (alive) {
                initUser();
            }
            else {
                clearUserInfo();
            }
        });

        if (!categoryTree) {
            //back-end is broken
            $state.go('home.404');
        }
        else {
            vmMain.categoryTree = categoryTree;
            vmMain.categoryList = CategoryService.getCategoryChildList(vmMain.categoryTree, 'group');
        }

        function clearUserInfo() {
            SecurityService.setAuthorized(false);
            vmMain.isAuthorized = false;
            vmMain.userInfo = null;
            WebSocketService.close();
            vmMain.showSignComponents = true;
            $rootScope.$broadcast(Events.logout);
        }

        function signOut() {
            SecurityService.logout().then(function () {
                clearUserInfo();
            }, function (error) {
                console.log("error: ", error);
            });
        }

        function searchByKeyword() {
            $state.go('home.itemList', {searchKeyword: vmMain.searchKeyword, categoryId: null});
        }

        function initUser() {
            SecurityService.getUserData().then(function (data) {
                UserNotificationService.getUnreadNotificationsCount().then(function (notificationsCountResponse) {
                    vmMain.notifications.unreadCount = notificationsCountResponse.unreadCount;
                    SecurityService.setAuthorized(true);
                    vmMain.userInfo = data;
                    vmMain.isAuthorized = true;
                    vmMain.showSignComponents = true;
                    WebSocketService.init();
                    if (!vmMain.userInfo.hasLocations) {
                        $uibModal.open({
                            templateUrl: 'core/locationModal.html',
                            controller: 'LocationModalInstanceController',
                            controllerAs: 'vmLocation',
                            resolve: {
                                location: function () {
                                    return null;
                                },
                                locationIndex: function() {
                                    return 0;
                                }
                            }
                        }).result.then(function () {
                            growl.addSuccessMessage("Location saved");
                            $rootScope.$broadcast(Events.locationUpdated);
                        });
                    }
                });
            }, function () {
                clearUserInfo();
            });
        }

        function onCategoriesShow() {
            var content = angular.element('#categories-area');
            if (!vmMain.categoriesShowed) {
                //if (vmMain.searchShowed) {
                //    onSearchShow();
                //}
                content.slideToggle(100);
                vmMain.categoriesShowed = true;
            }
            else {
                content.slideToggle(100);
                $timeout(function () {
                    vmMain.categoriesShowed = false;
                }, 100);
            }
        }


        function onSearchShow() {
            var content = angular.element('#search-area');
            if (!vmMain.searchShowed) {
                //if (vmMain.categoriesShowed) {
                //    onCategoriesShow();
                //}
                content.slideToggle(100);
                vmMain.searchShowed = true;
            }
            else {
                content.slideToggle(100);
                $timeout(function () {
                    vmMain.searchShowed = false;
                }, 100);
            }
        }

        function changeUser() {
            SecurityService.logout().then(function () {
                clearUserInfo();
                $state.go('home.login');
            });
        }

        function onCategoriesMenuMouseLeave() {
            if (!vmMain.categoriesShowed) {
                vmMain.selectedCategoryIndex = -1;
            }
        }

        function onParentCategoryClick($event, index) {
            $event.preventDefault();
            $event.stopPropagation();
            vmMain.selectedCategoryIndex = ((vmMain.selectedCategoryIndex !== -1) ? -1 : index);
        }

        function onNotificationsClick() {
            if (!vmMain.notifications.opened) {
                UserNotificationService.getNotifications().then(function (response) {
                    vmMain.notifications.items = response.items;
                    vmMain.notifications.items.forEach(function (notification) {
                        if (!!notification.planId) {
                            notification.planImageUrl = ImageService.getPlanImageById(notification.planId, 1, Sizes.small);
                        }
                    });
                    vmMain.notifications.opened = true;
                });
            }
            else {
                vmMain.notifications.items = [];
                vmMain.notifications.opened = false;
            }
        }

        function markNotificationAsRead($event, notification) {
            if (!!notification) {
                $event.preventDefault();
                $event.stopPropagation();
            }
            UserNotificationService.markNotificationAsRead(!notification ? null : notification.id).then(function () {
                if (!notification) {
                    vmMain.notifications.items.forEach(function (item) {
                        item.read = true;
                    });
                    vmMain.notifications.unreadCount = 0;
                }
                else {
                    notification.read = true;
                    vmMain.notifications.unreadCount--;
                }
            });
        }

    }

})();