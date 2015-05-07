'use strict';

angular.module('config').controller('config.RoleCtrl', ['$scope', 'config.Service', 'config.Constants', 'config.ConfiguredRoles', 'config.Role',
    function ($scope, Service, Constants, ConfiguredRoles, Role) {

        $scope.roles = ConfiguredRoles.getRoles();
    }
]);