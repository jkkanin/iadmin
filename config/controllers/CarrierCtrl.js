'use strict';

angular.module('config').controller('config.CarrierCtrl', ['$scope', 'config.ConfiguredVersions', 'config.ConfiguredCarriers',
    'config.Service',  'config.Constants', 'config.Carrier',
    function ($scope, ConfiguredVersions, ConfiguredCarriers, Service, Constants, Carrier) {

        $scope.firsttime = false;
        $scope.saved = false;
        $scope.carriers = ConfiguredCarriers.getCarriers();
        $scope.versions = ConfiguredVersions.getVersions();


        $scope.selectedCarrier = $scope.carriers[0];
        $scope.editableCarrier = angular.copy($scope.selectedCarrier);
        $scope.firsttime = false;

        $scope.setCarrierVersion = function() {

            $scope.carrierVersion = null;
            $scope.versions.forEach(function(version) {
                if (version.getId() == $scope.selectedCarrier.getVersionId()) {
                    $scope.carrierVersion = version;
                }
            });
        }

        $scope.setCarrierVersion();

        $scope.$watch('selectedCarrier', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            $scope.editableCarrier = angular.copy($scope.selectedCarrier);
            $scope.setCarrierVersion();
            $scope.firsttime = false;
        });

        $scope.addCarrier = function() {

            $scope.isAdd = true;

            var newCarrier =  new Carrier();
            $scope.carriers.push(newCarrier);
            $scope.selectedCarrier = newCarrier;
            $scope.carrierVersion = $scope.versions[0];
        }

        $scope.saveCarrier = function() {

            $scope.firsttime = true;
            if (!$scope.carrierform.$valid) {
                return;
            }

            $scope.editableCarrier.VersionId = $scope.carrierVersion.Id;
            if (!$scope.isAdd) {
                Service.httpCall('PUT', Constants.url.UpdateCarrier, $scope.setSavedCarrier, $scope.error, $scope.editableCarrier);
            } else {
                Service.httpCall('POST', Constants.url.AddCarrier, $scope.setSavedCarrier, $scope.error, $scope.editableCarrier);
            }
        }

        $scope.setSavedCarrier = function(data) {

            angular.extend($scope.selectedCarrier, $scope.editableCarrier)
            if ($scope.isAdd) {

                $scope.carriers = ConfiguredCarriers.getCarriers();
                $scope.selectedCarrier =  $scope.carriers[0];
            }
            $scope.isAdd = false;
            $scope.firsttime = false;
            $scope.saved = true;
        }

        $scope.error = function(data, status, headers, config) {
            alert("Application Error Occured. Please Contact Administrator");
        }

        $scope.cancelCarrier = function() {

            if ($scope.isAdd) {

                $scope.carriers.pop();
                $scope.selectedCarrier = $scope.carriers[0];
                $scope.isAdd = false;
            }
            $scope.editableCarrier = angular.copy($scope.selectedCarrier);
            $scope.firsttime = false;
            $scope.saved = false;
        }
    }
]);