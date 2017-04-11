/**
 * Created by cpro on 24.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendNotifications')
        .controller('NotificationsController', NotificationsController);

    NotificationsController.$inject = ['$scope', '$filter', '$q', 'Sizes', 'Events', 'ImageService', 'UserNotificationService'];

    function NotificationsController($scope, $filter, $q, Sizes, Events, ImageService, UserNotificationService) {
        var vmNotifications = this;

        vmNotifications.items = [];
        vmNotifications.userInfo = $scope.vmMain.userInfo;
        vmNotifications.unreadCount = $scope.vmMain.notifications.unreadCount;
        if (vmNotifications.unreadCount === null) {
            var unregister = $scope.$watch('vmMain.notifications.unreadCount', function (newVal) {
                if (angular.isDefined(newVal) && (newVal !== null)) {
                    vmNotifications.unreadCount = newVal;
                    unregister();
                }
            });
        }
        vmNotifications.pager = {
            currentPage: 1,
            totalCount: 0,
            pageSize: 10,
            maxSize: 5
        };
        vmNotifications.pageSizeList = [5, 10, 20, 50];

        vmNotifications.removeNotification = removeNotification;
        vmNotifications.markNotificationAsRead = markNotificationAsRead;
        vmNotifications.pageChanged = pageChanged;
        vmNotifications.getSelectedNotifications = getSelectedNotifications;
        vmNotifications.removeSelectedNotifications = removeSelectedNotifications;
        vmNotifications.markSelectedNotificationsAsRead = markSelectedNotificationsAsRead;
        vmNotifications.checkAll = checkAll;

        loadNotifications();

        $scope.$watch('vmNotifications.pager.pageSize', function (newVal, oldVal) {
            if (!!newVal && (newVal !== oldVal)) {
                loadNotifications();
            }
        });

        $scope.$on(Events.notifaction, function (event, data) {
            if (!!vmNotifications.userInfo) {
                angular.forEach(data.ids, function (notificationId, userId) {
                    if (vmNotifications.userInfo.id === userId) {
                        //TODO: maybe optimize here
                        loadNotifications();
                    }
                });
            }
        });

        function loadNotifications() {
            UserNotificationService.getNotifications(vmNotifications.pager.currentPage, vmNotifications.pager.pageSize).then(function (response) {
                vmNotifications.pager.totalCount = response.total;
                vmNotifications.items = response.items;
                vmNotifications.items.forEach(function (notification) {
                    if (!!notification.planId) {
                        notification.planImageUrl = ImageService.getPlanImageById(notification.planId, 1, Sizes.small);
                    }
                    // notification.planImageUrl = ImageService.getPlanImageById('011688b3-cb05-47dc-a52b-f7bef47850bc', 1, Sizes.small);
                });
            });
        }

        function removeNotification(notification) {
            UserNotificationService.deleteNotification(notification.id).then(function () {
                //TODO: maybe optimize here
                loadNotifications();
                if (!notification.read) {
                    vmNotifications.unreadCount--;
                    $scope.vmMain.notifications.unreadCount--;
                }
            });
        }

        function markNotificationAsRead(notification) {
            UserNotificationService.markNotificationAsRead(!notification ? null : notification.id).then(function () {
                if (!notification) {
                    vmNotifications.items.forEach(function (item) {
                        item.read = true;
                    });
                    vmNotifications.unreadCount = 0;
                }
                else {
                    notification.read = true;
                    vmNotifications.unreadCount--;
                    $scope.vmMain.notifications.unreadCount--;
                }
            });
        }

        function pageChanged() {
            loadNotifications();
        }

        function getSelectedNotifications() {
            return $filter('property')(vmNotifications.items, 'checked', true);
        }

        function removeSelectedNotifications() {
            var promises = [];
            getSelectedNotifications().forEach(function (notification) {
                promises.push(UserNotificationService.deleteNotification(notification.id));
                if (!notification.read) {
                    vmNotifications.unreadCount--;
                    $scope.vmMain.notifications.unreadCount--;
                }
            });
            $q.all(promises).then(function () {
                loadNotifications();
            });
        }

        function markSelectedNotificationsAsRead() {
            var promises = [];
            getSelectedNotifications().forEach(function (notification) {
                promises.push(UserNotificationService.markNotificationAsRead(notification.id));
                notification.read = true;
                vmNotifications.unreadCount--;
                $scope.vmMain.notifications.unreadCount--;

            });
            $q.all(promises).then(function () {
                checkAll(false);
            });
        }

        function checkAll(selected) {
            vmNotifications.items.forEach(function (notification) {
                notification.checked = selected;
            });
        }
    }

})();