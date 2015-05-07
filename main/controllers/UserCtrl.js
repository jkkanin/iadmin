'use strict';

angular.module('config').controller('config.UserCtrl', ['$scope', 'config.ConfiguredUsers',
    'config.Service',  'config.Constants', 'config.User',
    function ($scope, ConfiguredUsers, Service, Constants, User) {

        $scope.firsttime = false;
        $scope.saved = false;
        $scope.users = ConfiguredUsers.getUsers();

        $scope.selectedUser = $scope.users[0];
        $scope.editableUser = angular.copy($scope.selectedUser);
        $scope.firsttime = false;

//        $scope.LogintypeOptions = [
//            'App','Windows'
//        ];

        $scope.$watch('selectedUser', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            $scope.editableUser = angular.copy($scope.selectedUser);
            $scope.firsttime = false;
        });

        $scope.addUser = function() {

            $scope.isAdd = true;

            var newUser =  new User();
            $scope.users.push(newUser);
            $scope.selectedUser = newUser;
            $scope.msg = '';
        }

        $scope.saveUser = function() {

            $scope.firsttime = true;
            if (!$scope.userform.$valid) {
                return;
            }
            if ($scope.editableUser.getId()) {
                Service.httpCall('PUT', Constants.url.UpdateUser, $scope.setSavedUser, $scope.error, $scope.editableUser);
            } else {
                Service.httpCall('POST', Constants.url.AddUser, $scope.setSavedUser, $scope.error, $scope.editableUser);

            }
        }

        $scope.setSavedUser = function(data) {

        	if (data == "-1") {
        		
        		$scope.saved = true;
        		$scope.msg = 'User already Exists';
        	} else {
        		
        		$scope.editableUser.Id  = data;

                angular.extend($scope.selectedUser, $scope.editableUser)
                $scope.isAdd = false;
                $scope.firsttime = false;
                $scope.saved = true;
                $scope.msg = 'Saved Successfully';
                
        	}
            
        }

        $scope.error = function(data, status, headers, config) {
            alert("Application Error Occured. Please Contact Administrator");
        }

        $scope.cancelUser = function() {

            if ($scope.isAdd) {

                $scope.users.pop();
                $scope.selectedUser = $scope.users[0];
                $scope.isAdd = false;
            }
            $scope.editableUser = angular.copy($scope.selectedUser);
            $scope.firsttime = false;
            $scope.msg = '';
        }
    }
]);