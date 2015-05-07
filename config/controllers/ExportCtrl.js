'use strict';

angular.module('config').controller('config.ExportCtrl', ['$scope', 'config.ConfiguredCarriers',
    'config.Service',  'config.Constants', 'config.ServerEnv',
    function ($scope, ConfiguredCarriers, Service, Constants, ServerEnv) {

        $scope.carriers = ConfiguredCarriers.getCarriers();
        $scope.selectedServerEnvs = null;
		$scope.availableServerEnvs = new Array();
        $scope.firsttime = false;
        $scope.selectedCarrier = null;
        $scope.exported = null;

        $scope.exportScript = function() {

            $scope.firsttime = true;
            if (!$scope.exportform.$valid  || $scope.selectedServerEnvs.length === 0) {
                return;
            }

            $scope.ServerEnvNames = "";
            $scope.selectedServerEnvs.forEach(function(serverEnv) {
            	$scope.ServerEnvNames = $scope.ServerEnvNames.concat("serverEnvNames=" + serverEnv.ServerEnvName + "&");
            });

            $scope.ServerEnvNames = $scope.ServerEnvNames.substring(0, $scope.ServerEnvNames.length-1);

            location.href = Constants.serviceURL + "importExport/exportToSQLFile?code=" + $scope.selectedCarrier.Code + "&" + $scope.ServerEnvNames;
            
            $scope.exported = true;
        }

        $scope.exportSuccess = function(data) {
            $scope.exported = true;
        }

		$scope.getServerEnvs = function() {

			$scope.availableServerEnvs = new Array();
			$scope.selectedServerEnvs = arrayOfObjectToArrayOfPrototype(
				Service.ajaxCall("GET", Constants.url.GetServerEnvs + "/" + $scope.selectedCarrier.Code, false),
					function toServerEnv(appPageData) {
						return new ServerEnv(appPageData);
					});
        }

		$scope.getServerEnvDetails = function () {		
			$scope.exported = false;
			if ($scope.selectedCarrier) $scope.getServerEnvs();
		}
        
        //show error message in case of bad response from the server
        $scope.error =  function() {
            alert("Application Error Occured");
        }

        //move carrier from one list to another list
        $scope.moveItem = function(item, from, to, isAdd) {

        	$scope.exported = false;
            var idx = from.indexOf(item);
            if (idx != -1) {

                from.splice(idx, 1);
                to.push(item);
            }
        };
    }
]);