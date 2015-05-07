'use strict';

angular.module('login', ['util','config']);

angular.module('login').factory('login.Login',[
    function  (){
        var Login = function () {
            this.username = "";
            this.password = "";
        };
        return Login;
    }
]);

angular.module('login').service('login.LoginService',['util.Constants', '$http', '$rootScope',
    function  (Constants, $http, $rootScope) {

        var LoginService = {
            validate : function (login, success, error) {
                $rootScope.loading = true;
                $http({method : "GET", url: Constants.getLoginServiceURL(), params : login})
                    .success(function(data, status, headers, config) {
                        $rootScope.loading = false;
                        success(data, status, headers, config);
                    })
                    .error(function(data, status, headers, config) {
                        $rootScope.loading = false;
                        error(data, status, headers, config);
                    });
            }
        };
        return LoginService;
    }
]);

angular.module('login').controller('login.LoginViewCtrl',['$scope','$location', "login.Login", 'login.LoginService',
    '$rootScope',
    function ($scope, $location, Login, LoginService, $rootScope) {
        $scope.model = new Login();
        $scope.validationError = "";

        $location.search({});
        $location.hash('');

        var successCallback = function (data, status, headers, config) {
            if(data != "") {

                for (var key in data) {

                    if (!data[key] || data[key].length == 0) {
                        $scope.validationError = "Roles not assigned to the user";
                        return;
                    }
                    $rootScope.username = key;
                    $rootScope.assignedRoles = data[key];
                }

                $location.path('/main/home');
            }
            else {
                $scope.validationError = "Username/Password doesn't match.";
            }
        }

        var errorCallback = function (data, status, headers, config) {

        }

        $scope.validateLogin = function() {
            if ($scope.model.username && $scope.model.password) {
                LoginService.validate($scope.model, successCallback, errorCallback);
            } else {
                $scope.validationError = "Please enter valid Username and password.";
            }
    };
    }
]);

angular.module('login').controller('login.ChangePasswordCtrl',['$scope','$location','$rootScope','config.Constants','$http','config.Service',
    function ($scope, $location, $rootScope, Constants, $http, Service) {

        $scope.msg ="";
        $scope.validationError ="";
        $scope.saved = false;

        $scope.SavePassword = function() {
             $scope.validate();
            if (!$scope.isvalidate) {
                return;
            }
            Service.httpCall('PUT', Constants.url.ChangePassword, $scope.setchangepwd, $scope.error, {"Username":$rootScope.username,"OldPassword":$scope.oldpassword,"NewPassword":$scope.newpassword});
        }

        $scope.setchangepwd = function() {

            $scope.saved = true;
            $scope.msg = 'Password Changed Successfully';
            $scope.validationError ="";
            $scope.oldpassword ="";
            $scope.newpassword ="";
            $scope.confirmpassword ="";
        }

        $scope.validate = function(){

            $scope.isvalidate =true;
            if(!$scope.oldpassword || $scope.oldpassword.length == 0
                || !$scope.newpassword || $scope.newpassword.length == 0
                || !$scope.confirmpassword || $scope.confirmpassword.length == 0){
                $scope.validationError ="Please enter the password";
                $scope.isvalidate = false;
                return;
            }
            if ($scope.newpassword.length < 8 || $scope.newpassword.length > 15
                || $scope.confirmpassword.length < 8 || $scope.confirmpassword.length > 15){
                $scope.validationError ="Password length should not be less than 8 and more than 15.";
                $scope.isvalidate = false;
                return;
            }
            if($scope.oldpassword == $scope.newpassword){
                $scope.validationError ="change password cannot be the old password";
                $scope.isvalidate = false;
                return;
            }
            if ($scope.newpassword != $scope.confirmpassword){
                $scope.validationError ="Password mismatch";
                $scope.isvalidate = false;
                return;
            }
        }

        $scope.error = function(data, status, headers, config) {
//            alert("Application Error Occured. Please Contact Administrator");
            $scope.validationError ="Invalid Old password.";

        }

        $scope.RedirectHome = function() {
            $location.path('/main/home');
        }
    }
]);

