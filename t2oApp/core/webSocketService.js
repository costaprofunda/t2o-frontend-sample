/**
 * Created by cpro on 25.10.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendCore')
        .service('WebSocketService', WebSocketService);

    WebSocketService.$inject = ['$rootScope', '$timeout', '$websocket', 'growl', 'Env', 'Params', 'SecurityService'];

    function WebSocketService($rootScope, $timeout, $websocket, growl, Env, Params, SecurityService) {

        var readyStateConstants = {
            0: 'CONNECTING',
            1: 'OPEN',
            2: 'CLOSING',
            3: 'CLOSED',
            4: 'RECONNECT_ABORTED'
        };

        var ws = null;

        this.init = init;
        this.close = close;
        this.getCurrentState = getCurrentState;

        function init() {
            if (!!$websocket && (!ws || (readyStateConstants[ws.readyState] === 'CLOSED'))) {

                //getCurrentState();

                console.log('WebSocket init...');
                ws = $websocket(Env.socketUrl);

                ws.onOpen(function () {
                    console.log("WebSocket state: ", readyStateConstants[ws.readyState]);
                });

                ws.onMessage(function (event) {
                    var data = angular.fromJson(event.data);
                    console.log("data: ", data);
                    if (!!data.message) {
                        growl.addInfoMessage(data.message);
                    }
                    if (!!data.identity) {
                        $rootScope.$broadcast(data.identity, data.data);
                    }
                });

                ws.onClose(function (close) {
                    console.log("WebSocket state: ", readyStateConstants[ws.readyState]);
                    //console.log("close: ", close);
                    //if (SecurityService.isAuthorized() && (Params.wsRelaunchErrorCodes.indexOf(close.code) >= 0)) {
                    if (SecurityService.isAuthorized()) {
                        $timeout(function () {
                            init();
                            console.log("WebSocket state: ", readyStateConstants[ws.readyState]);
                        }, Params.secondsToRestartWebSocket * 1000);
                    }
                    //}
                });

                ws.onError(function (error) {
                    console.log("error: ", error);
                });
            }
        }

        function close() {
            console.log('WebSocket closing...');
            if (!!ws) {
                ws.close();
            }
        }

        function getCurrentState() {
            if (!!ws) {
                growl.addSuccessMessage('WebSocket state: ' + readyStateConstants[ws.readyState]);
            }
            else growl.addErrorMessage('WebSocket is not created', {});
        }

    }

})();