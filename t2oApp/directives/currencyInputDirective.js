/**
 * Created by cpro on 08.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendDirectives')
        .directive('currencyInput', currencyInput);

    currencyInput.$inject = [];

    function currencyInput() {
        return {
            restrict: 'A',
            replace: true,
            template: '<span><input type="text" ng-model="model"></span>',
            scope: {
                model: '=',
                allowZero: '=?'
            },
            link: function (scope, elem, attrs) {

                String.prototype.splice = function (idx, rem, s) {
                    return (this.slice(0, idx) + s + this.slice(idx + Math.abs(rem)));
                };

                if (!!scope.model) {
                    scope.model = '' + scope.model;
                    format();
                }

                elem[0].className = '';
                elem.find('input')
                    .addClass(attrs.class)
                    .attr('placeholder', attrs.placeholder);
                elem.bind('keyup, input', function () {
                    var input = elem.find('input');
                    //var inputVal = input.val();

                    if (!!scope.model) {
                        format(true);
                    }
                });

                function format(bind) {
                    if (!scope.allowZero) {
                        while (scope.model.charAt(0) == '0') {
                            scope.model = scope.model.substr(1);
                        }
                    }

                    //clearing left side zeros
                    scope.model = scope.model.replace(/[^\d.\',']/g, '');

                    var point = scope.model.indexOf(".");
                    if (point >= 0) {
                        scope.model = scope.model.slice(0, point + 3);
                    }

                    var decimalSplit = scope.model.split(".");
                    var intPart = decimalSplit[0];
                    var decPart = decimalSplit[1];

                    intPart = intPart.replace(/[^\d]/g, '');
                    if (intPart.length > 3) {
                        var intDiv = Math.floor(intPart.length / 3);
                        while (intDiv > 0) {
                            var lastComma = intPart.indexOf(",");
                            if (lastComma < 0) {
                                lastComma = intPart.length;
                            }

                            if (lastComma - 3 > 0) {
                                intPart = intPart.splice(lastComma - 3, 0, ",");
                            }
                            intDiv--;
                        }
                    }

                    if (decPart === undefined) {
                        decPart = "";
                    }
                    else {
                        decPart = "." + decPart;
                    }
                    var res = intPart + decPart;
                    if (res) {
                        res = '$' + res;
                    }

                    if (!!bind) {
                        scope.$apply(function () {
                            scope.model = res;
                        });
                    }
                    else {
                        scope.model = res;
                    }

                }
            }
        };
    }

})();