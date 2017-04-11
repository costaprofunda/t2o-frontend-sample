/**
 * Created by cpro on 23.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .factory('UserNotificationService', UserNotificationService);

    UserNotificationService.$inject = ['Params', 'Restangular'];

    function UserNotificationService(Params, Restangular) {

        var service = {
            getNotifications: getNotifications,
            markNotificationAsRead: markNotificationAsRead,
            getUnreadNotificationsCount: getUnreadNotificationsCount,
            deleteNotification: deleteNotification
        };

        function getNotifications(currentPage, pageSize) {
            return Restangular.one('user', 'notifications').customGET('', {
               current: currentPage || 1,
               size: pageSize || Params.notificationsDropdownItemsCount
            });
        }

        function markNotificationAsRead(notificationId) {
            // var deferred = $q.defer();
            // deferred.resolve();
            // return deferred.promise;
            if (!notificationId) {
               return Restangular.one('user', 'notifications').customPUT();
            }
            return Restangular.one('user', 'notifications').customPUT(null, notificationId);
        }

        function getUnreadNotificationsCount() {
            // var deferred = $q.defer();
            // deferred.resolve({unreadCount: 4});
            // return deferred.promise;
            return Restangular.one('user', 'notifications').customGET('count');
        }

        function deleteNotification(notificationId) {
            // var deferred = $q.defer();
            // deferred.resolve();
            // return deferred.promise;
            return Restangular.one('user', 'notifications').customDELETE(notificationId);
        }

        return service;

    }

})();