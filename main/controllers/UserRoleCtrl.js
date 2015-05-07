'use strict';

angular.module('main').controller('main.UserRoleCtrl', ['$scope', 'config.Service', 'config.Constants',
    'config.ConfiguredUsers', 'config.ConfiguredRoles','config.Role','config.User',
    function ($scope, Service, Constants, ConfiguredUsers, ConfiguredRoles, Role) {

        $scope.users = ConfiguredUsers.getUsers();
        $scope.roles = ConfiguredRoles.getRoles();

        $scope.user = $scope.users[0];

        $scope.getUserRoles = function() {
            Service.httpCall("GET", Constants.url.GetAllRolesByUserId + "/" + $scope.user.getId(), $scope.loadUserRoles,  $scope.error);
        }

        $scope.loadUserRoles = function(data, status, headers, config) {

            $scope.selectedRoles = arrayOfObjectToArrayOfPrototype(data,
                function toRole(roleData) {
                    return new Role(roleData);
                });;

            $scope.availableRoles = new Array();

            $scope.roles.forEach(function(role) {

                var exist = false;
                $scope.selectedRoles.forEach(function(userRole) {
                   if (role.getId() == userRole.getId()) {
                       exist = true;
                   }
                });
                if (!exist) {
                    $scope.availableRoles.push(role);
                }
            });

        }

        $scope.error = function(data, status, headers, config) {
            alert("Application Error Occured. Please Contact Administrator");
        }

        $scope.getUserRoles();

        $scope.moveItem = function(item, from, to, isAdd) {

            var idx = from.indexOf(item);
            if (idx != -1) {

                from.splice(idx, 1);
                to.push(item);

                if (isAdd) {
                    Service.httpCall("POST", Constants.url.AddUserRole, function() {},  $scope.error,
                        {   "UserId" : $scope.user.getId(),
                            "RoleId" : item.getId()}
                    );
                } else {
                    Service.httpCall("DELETE", Constants.url.DeleteUserRole, function() {},  $scope.error,
                        { "UserId" : $scope.user.getId(),
                          "RoleId" : item.getId()}
                    );
                }
            }
        };

        $scope.$watch('user', function(newValue, oldValue) {
            if ( newValue != oldValue) {
                $scope.getUserRoles();
            }
        });
    }
]);