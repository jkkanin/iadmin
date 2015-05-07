'use strict';

var dashboard = angular.module('main', ['config', 'acl']);

angular.module('main').controller('main.MainViewCtrl',['$scope','$location','$rootScope', 'main.MenuService', '$routeParams',
    function ($scope, $location, $rootScope, MenuService, $routeParams) {

		if ($rootScope.assignedRoles == null) {
            $location.path('/login');
            return;
        }

        $scope.page = $routeParams.page;

        $scope.menuService = new MenuService($rootScope.assignedRoles);

        $scope.pageUrl = [
            {Page : "home", Url : 'templates/main/home.html'},
            {Page : "user",
                SubMenus : ['templates/main/users.html', 'templates/main/roles.html', 'templates/main/user_roles.html']},
            {Page : "carrier",
                SubMenus : ['templates/main/carrier.html', 'templates/main/language.html', 'templates/main/carrier_language.html']},
            {Page : "configuration",
                SubMenus : ['templates/main/config.html', 'templates/main/export.html', 'templates/main/import.html', 'templates/main/activate_config.html', 'templates/main/server_environment.html']},
            {Page : "locales", Url : 'templates/main/locale.html'},
            {Page : "changePwd", Url : 'templates/main/change_password.html'},
            {Page : "errorlocales",
                SubMenus : ['templates/main/universal_scripts.html', 'templates/main/carrier_scripts.html']}];

        $scope.routingTo = function(url, hash) {

            $location.search({});
            $location.hash('');
            $location.path(url);
            if (hash) {
                $location.hash(hash);
            }
        }

        $scope.setPageBodyURL = function () {

            var page = $scope.page;
            var hash = $location.hash();
            $scope.pageUrl.forEach(function(pages) {
                if (pages.Page == page) {

                    if (hash) {
                        $scope.bodyURL = pages.SubMenus[hash - 1];
                    } else {
                        $scope.bodyURL = pages.Url;
                    }
                }
            });
        }

        $scope.setPageBodyURL();

        $scope.isAllowed = function (menuName) {
            return $scope.menuService.isAllowed(menuName);
        }

        $scope.logout = function () {
            $rootScope.assignedRoles = null;
            $location.path('/logout');
        }
    }
]);
angular.module('main').factory('main.MenuService', ['acl.ACLConfig',
    function (AclConfig) {
        var MenuService = function (roles) {
            this.roles = roles,
            this.isAllowed = function (menuName) {
                var rolesByMenu = null;
                if ("User" == menuName) {
                    rolesByMenu = [AclConfig.getRoles()[0]];
                } else if ("Carrier" == menuName) {
                    rolesByMenu = [AclConfig.getRoles()[0]];
                } else {
                    rolesByMenu = AclConfig.getRolesByMenu(menuName);
                }
                for (var i = 0; i < rolesByMenu.length; i++) {
                    for (var j = 0; j < roles.length; j++) {
                        if (rolesByMenu[i] == roles[j].Name) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }
        return MenuService;
    }
]);

angular.module('main').directive('menuItem', [
    function () {
        return {
            restrict : "E",
            replace : true,
            link : function (scope, element, attrs) {
                if (scope.isAllowed && scope.isAllowed(attrs.name)) {
                    element.replaceWith(element.contents());
                } else {
                    element.replaceWith(' ');
                }
            }
        }
    }
]);


angular.module('config').service('config.DashboardService',['$rootScope','config.Constants', 'config.Service',

    function ($rootScope, Constants, Service) {

        var DashboardService = {
            getDashboardDetails : function(success, error) {
                Service.httpCall('GET', Constants.url.GetDashboardInfo + $rootScope.username, success, error);
            },
			
			getErrorDashboardInfo : function(success, error, errorType) {
            Service.httpCall('GET', Constants.url.getErrorDashboardInfo + "/" + errorType, success, error);
        }
        };

        return DashboardService;
    }]);