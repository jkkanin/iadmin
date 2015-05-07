'use strict';

angular.module('config').controller('config.ServerEnvironmentCtrl', ['$scope', 'config.ConfiguredCarriers',
    'config.Service',  'config.Constants', 'config.ServerEnv',
    function ($scope, ConfiguredCarriers, Service, Constants, ServerEnv) {

        $scope.carriers = ConfiguredCarriers.getCarriers();
        $scope.selServerEnvIds = new Array();
        $scope.newServerEnv = new ServerEnv();
        $scope.chkAllServerEnvs = null;
        $scope.allServerEnvs = null;
        $scope.firsttime = false;
        $scope.selectedCarrier = null;

        $scope.getServerEnvs = function() {
            Service.httpCall('GET', Constants.url.GetServerEnvs + "/" + $scope.selectedCarrier.Code, $scope.getServerEnvsSuccess, $scope.error, null);
        }

        $scope.getServerEnvDetails = function () {
            $scope.successMsg = null;
            if ($scope.selectedCarrier) $scope.getServerEnvs();
        }

        $scope.getServerEnvsSuccess = function (data) {
            $scope.allServerEnvs = data;
        }

        $scope.getSelServerEnvIds = function ($event) {

            if ($event.target.checked) {
                $scope.selServerEnvIds.push($event.target.id);
            } else {
                $scope.selServerEnvIds.splice($.inArray($event.target.id, $scope.selServerEnvIds),1);
            }
            $scope.chkAllServerEnvs = ($scope.allServerEnvs.length === $scope.selServerEnvIds.length ? true : false);
        };

        $scope.selAllServerEnvs = function ($event) {

            if ($event.target.checked) {
                $scope.selServerEnvIds = new Array();
                $scope.allServerEnvs.forEach(function(serverEnv) {
                    $scope.selServerEnvIds.push(serverEnv.Id);
                });
            } else {
                $scope.selServerEnvIds = new Array();
            }
            $("td input:checkbox").prop("checked", $event.target.checked);
        }

        $scope.showRemoveConfirmation = function() {
        	$scope.successMsg = null;
            $('#removeServerEnvModal').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }

        $scope.removeServerEnvs = function() {
            Service.httpCall('POST', Constants.url.RemoveServerEnvs, $scope.removeServerEnvsSuccess, $scope.error, $scope.selServerEnvIds);
        }

        $scope.removeServerEnvsSuccess = function(data) {

            $scope.selServerEnvIdsStr = ',' + $scope.selServerEnvIds.join(',') + ',';

            for (var i =  $scope.allServerEnvs.length - 1; i > -1; i--) {
                if ($scope.selServerEnvIdsStr.indexOf($scope.allServerEnvs[i].Id) > -1) {
                    $scope.allServerEnvs.splice(i, 1);
                }
            }
            $scope.selServerEnvIds = new Array();
            $scope.successMsg = "Removed Successfully";
        }

        $scope.showAddServerEnv = function() {
        	$scope.successMsg = null;
            $scope.newServerEnv = new ServerEnv();
            $('#addServerEnvModal').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }

        $scope.addServerEnv = function () {

            if (!$scope.addServerEnvForm.$valid) {
                return;
            }
            $scope.firsttime = true;
            $scope.newServerEnv.CarrierCode = $scope.selectedCarrier.Code;
            Service.httpCall('POST', Constants.url.SaveServerEnv, $scope.addServerEnvSuccess, $scope.error, $scope.newServerEnv);
        }

        $scope.addServerEnvSuccess = function(data) {
            $scope.successMsg = "Added Successfully";
            $scope.newServerEnv.Id = data;

            if (!$scope.allServerEnvs)
                $scope.allServerEnvs = new Array();

            $scope.allServerEnvs.push($scope.newServerEnv);
            $scope.firsttime = false;
            $('#addServerEnvModal').modal('hide');
        }

        $scope.error =  function() {
            alert("Application Error Occured");
        }
    }
]);