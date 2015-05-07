'use strict';

angular.module('config').controller('config.ActivateConfigCtrl', ['$scope', 'config.ConfiguredVersions', 'config.ConfiguredCarriers',
    'config.Service',  'config.Constants', 'config.Carrier',
    function ($scope, ConfiguredVersions, ConfiguredCarriers, Service, Constants, Carrier) {

        $scope.carriers = ConfiguredCarriers.getCarriers();

        $scope.$watch('selectedCarrier', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            $scope.getImportedVersion();
            $scope.activated = false;
        });

        $scope.getImportedVersion = function() {
            Service.httpCall('GET', Constants.url.GetImportedConfigurations + "/" + $scope.selectedCarrier.getCode(), $scope.setImportedVersion, $scope.error, null);
        }

        $scope.setImportedVersion = function(data) {
            $scope.versions =  data;
            $scope.selectedVersion = $scope.versions[0];
        }

        $scope.selectedCarrier = $scope.carriers[0];
        $scope.getImportedVersion();
        $scope.activated = false;

        $scope.activateConfig = function() {
            $scope.selectedVersion.Active = true;
            Service.httpCall('POST', Constants.url.ActivateConfiguration, $scope.activateSuccess, $scope.error, $scope.selectedVersion);
        }

        $scope.activateSuccess = function() {
            $scope.activated = true;
        }
    }
]);