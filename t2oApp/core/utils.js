/**
 * Created by cpro on 09.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .factory('Utils', Utils);

    Utils.$inject = ['$q'];

    function Utils($q) {

        var service = {
            isImageSourceValid: isImageSourceValid,
            getDaysUntilNow: getDaysUntilNow,
            arrayUnique: arrayUnique,
            unTagArray: unTagArray,
            isStringUrl: isStringUrl
        };

        function isImageSourceValid(src) {
            var deferred = $q.defer();

            var image = new Image();
            image.onerror = onError;
            image.onload = onLoad;
            image.src = src;

            return deferred.promise;

            function onError() {
                deferred.reject();
            }

            function onLoad() {
                deferred.resolve();
            }

        }

        function getDaysUntilNow(date) {
            var now = moment();
            var ourDate = moment(date);
            return ourDate.diff(now, 'days');
        }

        function arrayUnique(array) {
            var a = array.concat();
            for (var i = 0; i < a.length; ++i) {
                for (var j = i + 1; j < a.length; ++j) {
                    if (a[i] === a[j])
                        a.splice(j--, 1);
                }
            }

            return a;
        }

        function unTagArray(array) {
            var newArray = [];
            array.forEach(function (elem) {
                newArray.push(elem.text);
            });
            return newArray;
        }

        function isStringUrl(urlString) {
            return ((urlString.indexOf('http://') === 0) || (urlString.indexOf('https://') === 0));
        }

        return service;

    }

})();