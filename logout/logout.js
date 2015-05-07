'use strict';

var logout = angular.module('logout', []);

angular.module('logout').controller('logout.LogoutViewCtrl',['$scope','$location',
    function ($scope, $location) {

        $scope.next = function () {
            $location.path('/login');
        }

    }
]);