/**
 * Created by cpro on 09.03.16.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('userAvatar', userAvatar);

    userAvatar.$inject = ['Utils', 'ImageService'];

    function userAvatar(Utils, ImageService) {
        return {
            restrict: 'EA',
            replace: true,
            templateUrl: 'directives/userAvatar.html',
            scope: {
                model: '=?',
                imageUrl: '=?',
                large: '@'
            },
            link: function (scope) {
                if (!scope.model) {
                    var unregister = scope.$watch('model', function (newVal, oldVal) {
                        if (!!newVal && !angular.equals(newVal, oldVal)) {
                            initLink();
                            unregister();
                        }
                    });
                }
                else {
                    initLink();
                }

                function initLink() {
                    var imageLink = ImageService.getUserImageById(scope.model.userId || scope.model.id, !!scope.large, true);
                    //var imageLink = 'https://scontent.xx.fbcdn.net/hprofile-xfa1/v/t1.0-1/c153.33.414.414/s50x50/262463_236037399769634_8021060_n.jpg?oh=2e39331b0358b07e8835f92743da4ca9&oe=57975303';
                    Utils.isImageSourceValid(imageLink).then(function () {
                        scope.model.imageUrl = imageLink;
                    });
                }
            }
        };
    }

})();