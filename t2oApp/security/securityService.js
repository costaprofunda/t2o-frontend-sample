/**
 * Created by cpro on 05.09.15.
 */

(function () {

    'use strict';

    angular
        .module('t2oFrontendSecurity')
        .service('SecurityService', SecurityService);

    SecurityService.$inject = ['$http', '$q', '$window', '$cookies', 'Facebook', 'Env', 'Params'];

    function SecurityService($http, $q, $window, $cookies, Facebook, Env, Params) {

        var authUrl = '/user/login';
        var userDataUrl = '/user/data';
        var signUpUrl = '/user/register';
        var signOutUrl = '/user/logout';
        var heartbeatUrl = '/user/heartbeat';
        var facebookAuthUrl = '/authenticate/facebook';
        var adminPageUrl = '/admin';

        this.authUrl = authUrl;
        this.authenticate = authenticate;
        this.logout = logout;
        this.getUserData = getUserData;
        this.signUp = signUp;
        this.isAuthorized = isAuthorized;
        this.isSessionAlive = isSessionAlive;
        this.getVersion = getVersion;
        this.setVersion = setVersion;
        this.setAuthorized = setAuthorized;
        this.loginUsingFacebook = loginUsingFacebook;
        this.setNewPassword = setNewPassword;
        this.getLinkToAdminPage = getLinkToAdminPage;
        this.isWindowsUser = isWindowsUser;

        function authenticate(credentials) {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + authUrl;
            $http.post(queryUrl, credentials)
                .success(function () {
                    $window.localStorage.isAuthorized = true;
                    deferred.resolve();
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function logout() {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + signOutUrl;
            $http.post(queryUrl)
                .success(function () {
                    $cookies.remove(Params.authCookieName);
                    delete $window.localStorage.isAuthorized;
                    deferred.resolve();
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getUserData() {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + userDataUrl;
            $http.get(queryUrl)
                .success(function (response) {
                    deferred.resolve(response.data);
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function signUp(regForm) {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + signUpUrl;
            $http.post(queryUrl, regForm)
                .success(function () {
                    //$cookies.remove(Params.authCookieName);
                    deferred.resolve();
                }).error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function isAuthorized() {
            //console.log("!!$cookies.get(Params.authCookieName): ", !!$cookies.get(Params.authCookieName));
            //console.log("($window.localStorage.isAuthorized == 'true')", ($window.localStorage.isAuthorized == "true"));
            //console.log("($window.localStorage.isAuthorized == true)", ($window.localStorage.isAuthorized == true));
            return !!$cookies.get(Params.authCookieName) || ($window.localStorage.isAuthorized == "true") || ($window.localStorage.isAuthorized == true);
        }

        function facebookAuthenticate(email, firstName, lastName, id, signedRequest, imageSmall, imageLarge) {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + facebookAuthUrl;
            $http.post(queryUrl, {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    id: id,
                    signedRequest: signedRequest,
                    imageSmall: imageSmall,
                    imageLarge: imageLarge
                })
                .success(function () {
                    $window.localStorage.isAuthorized = true;
                    deferred.resolve();
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getFacebookUserInfo() {
            var deferred = $q.defer();
            Facebook.api('/me', function (apiResponse) {
                if (!apiResponse.email && !!apiResponse.id) {
                    apiResponse.email = apiResponse.id + "@facebook.com";
                }
                Facebook.api(apiResponse.id + '/picture', function (pictureSmallResponse) {
                    apiResponse.imageSmall = pictureSmallResponse.data.url;
                    Facebook.api(apiResponse.id + '/picture?type=large', function (pictureLargeResponse) {
                        apiResponse.imageLarge = pictureLargeResponse.data.url;
                        //console.log("apiResponse", apiResponse);
                        deferred.resolve(apiResponse);
                    });
                });
            });
            return deferred.promise;
        }

        function loginUsingFacebook() {
            var deferred = $q.defer();
            Facebook.getLoginStatus(function (loginStatusResponse) {
                if (loginStatusResponse.status === 'connected') {
                    getFacebookUserInfo().then(function (apiResponse) {
                        facebookAuthenticate(apiResponse.email, apiResponse.first_name, apiResponse.last_name, apiResponse.id, loginStatusResponse.authResponse.signedRequest, apiResponse.imageSmall, apiResponse.imageLarge).then(function () {
                            deferred.resolve();
                        });
                    });
                } else {
                    Facebook.login(function (loginResponse) {
                        getFacebookUserInfo().then(function (apiResponse) {
                            //console.log("apiResponse: ", apiResponse);
                            facebookAuthenticate(apiResponse.email, apiResponse.first_name, apiResponse.last_name, apiResponse.id, loginResponse.authResponse.signedRequest, apiResponse.imageSmall, apiResponse.imageLarge).then(function () {
                                deferred.resolve();
                            });
                        });
                    });
                }
            });
            return deferred.promise;
        }

        function isSessionAlive() {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + heartbeatUrl;
            $http.head(queryUrl)
                .success(function () {
                    deferred.resolve(true);
                }).error(function () {
                    deferred.resolve(false);
                });
            return deferred.promise;
        }

        function getVersion() {
            return $window.localStorage.version;
        }

        function setVersion(version) {
            $window.localStorage.version = version;
        }

        function setAuthorized(authorized) {
            $window.localStorage.isAuthorized = authorized;
        }

        function setNewPassword(userId, passwordData) {
            var deferred = $q.defer();
            var queryUrl = Env.apiUrl + '/user/profile/' + userId + '/password';
            $http.put(queryUrl, passwordData)
                .success(function () {
                    deferred.resolve();
                })
                .error(function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        }

        function getLinkToAdminPage() {
            return Env.apiUrl + adminPageUrl;
        }

        function isWindowsUser() {
            var osName = navigator.oscpu;
            if (!osName) {
                return false;
            }
            //'Windows 3.11' => 'Win16',
            //'Windows 95' => '(Windows 95)|(Win95)|(Windows_95)',
            //'Windows 98' => '(Windows 98)|(Win98)',
            //'Windows 2000' => '(Windows NT 5.0)|(Windows 2000)',
            //'Windows XP' => '(Windows NT 5.1)|(Windows XP)',
            //'Windows Server 2003' => '(Windows NT 5.2)',
            //'Windows Vista' => '(Windows NT 6.0)',
            //'Windows 7' => '(Windows NT 6.1)',
            //'Windows 8' => '(Windows NT 6.2)|(WOW64)',
            //'Windows NT 4.0' => '(Windows NT 4.0)|(WinNT4.0)|(WinNT)|(Windows NT)',
            //'Windows ME' => 'Windows ME',
            //'Open BSD' => 'OpenBSD',
            //'Sun OS' => 'SunOS',
            //'Linux' => '(Linux)|(X11)',
            //'Mac OS' => '(Mac_PowerPC)|(Macintosh)',
            //'QNX' => 'QNX',
            //'BeOS' => 'BeOS',
            //'OS/2' => 'OS/2',
            //'Search Bot'=>'(nuhk)|(Googlebot)|(Yammybot)|(Openbot)|(Slurp)|(MSNBot)|(Ask Jeeves/Teoma)|(ia_archiver)'
            return (osName.indexOf("Win") !== -1) || (osName.indexOf("WOW64") !== -1);
        }

    }

})();