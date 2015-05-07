'use strict';

/* adminConsoleApp module definition*/

var angularApp = angular.module('adminConsoleApp', ['login','main','logout']);

angularApp.config(['$routeProvider', '$locationProvider',function($routeProvider, $locationProvider) {
    $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: 'login.LoginViewCtrl'});
    $routeProvider.when('/main/:page', {templateUrl: 'views/main.html', controller: 'main.MainViewCtrl'});
    $routeProvider.when('/logout', {templateUrl: 'views/logout.html', controller: 'logout.LogoutViewCtrl'});
    $routeProvider.otherwise({redirectTo: '/login'});
}]);
