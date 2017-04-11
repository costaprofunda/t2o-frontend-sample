/**
 * Created by cpro on 03.02.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('chat', chat);

    chat.$inject = ['$filter', 'Events', 'ChatService'];

    function chat($filter, Events, ChatService) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: 'directives/chat.html',
            scope: {
                model: '=',
                user: '=',
                viewId: '@',
                objId: '@',
                planId: '@',
                onEditReply: '&',
                deleteReply: '&',
                postReply: '&',
                onCancelReply: '&'
            },
            link: function (scope) {

                scope.onEditReply = onEditReply;
                scope.deleteReply = deleteReply;
                scope.postReply = postReply;
                scope.onCancelReply = onCancelReply;

                scope.$on(Events.chatMessageAdded, function (event, data) {
                    if ((data.planId === scope.planId) && (data.objId === scope.objId) && !!scope.model.showChatArea) {
                        var newNode = {
                            id: data.messageId,
                            message: data.text,
                            author: {
                                id: data.userId,
                                firstName: data.firstName,
                                lastName: data.lastName
                            },
                            replies: [],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        };
                        if (!data.rootId) {
                            scope.model.chatTree.push(newNode);
                        }
                        else {
                            newNode.receiver = {
                                id: data.parent.userId,
                                firstName: data.parent.firstName,
                                lastName: data.parent.lastName
                            };
                            var root = $filter('property')(scope.model.chatTree, 'id', data.rootId)[0];
                            root.replies.push(newNode);
                        }
                    }
                });

                scope.$on(Events.chatMessageUpdated, function (event, data) {
                    if ((data.planId === scope.planId) && (data.objId === scope.objId) && !!scope.model.showChatArea) {
                        if (!data.rootId) {
                            var updatedRoot = $filter('property')(scope.model.chatTree, 'id', data.messageId)[0];
                            updatedRoot.message = data.text;
                            updatedRoot.updatedAt = new Date();
                        }
                        else {
                            var root = $filter('property')(scope.model.chatTree, 'id', data.rootId)[0];
                            var updatedLeaf = $filter('property')(root.replies, 'id', data.messageId)[0];
                            updatedLeaf.message = data.text;
                            updatedLeaf.updatedAt = new Date();
                        }
                    }
                });

                scope.$on(Events.chatMessageDeleted, function (event, data) {
                    if ((data.planId === scope.planId) && (data.objId === scope.objId) && !!scope.model.showChatArea) {
                        if (!data.rootId) {
                            var deletedRoot = $filter('property')(scope.model.chatTree, 'id', data.messages[data.messages.length - 1])[0];
                            scope.model.chatTree.splice(scope.model.chatTree.indexOf(deletedRoot), 1);
                        }
                        else {
                            var root = $filter('property')(scope.model.chatTree, 'id', data.rootId)[0];
                            data.messages.forEach(function (messageId) {
                                var deletedLeaf = $filter('property')(root.replies, 'id', messageId)[0];
                                root.replies.splice(root.replies.indexOf(deletedLeaf), 1);
                            });
                        }
                    }
                });

                function postReply(node) {
                    if (!node) {
                        ChatService.saveReply(scope.objId, scope.model.newReply).then(function () {
                            scope.model.newReply = "";
                        });
                        return;
                    }
                    if (!node.edit) {
                        ChatService.saveReply(scope.objId, node.reply, node.id).then(function () {
                            node.reply = "";
                            node.showReply = false;
                        });
                    }
                    else {
                        ChatService.editReply(scope.objId, node.id, node.reply).then(function () {
                            node.message = node.reply;
                            node.edit = false;
                            node.reply = "";
                            node.showReply = false;
                        });
                    }
                }

                function onCancelReply(node) {
                    if (!node) {
                        scope.model.newReply = '';
                    }
                    else {
                        node.edit = false;
                        node.reply = "";
                        node.showReply = false;
                    }
                }

                function onEditReply(node) {
                    node.edit = true;
                    node.reply = node.message;
                }

                function deleteReply(node) {
                    ChatService.deleteReply(scope.objId, node.id).then(function () {
                        node.reply = "";
                        node.showReply = false;
                    });
                }

            }
        };
    }

})();