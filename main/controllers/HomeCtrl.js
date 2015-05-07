'use strict';

angular.module('main').controller('main.HomeCtrl', ['$scope','config.DashboardService',
    'config.Service', 'config.Constants', '$http', '$location', '$rootScope', 'acl.ACLConfig', 'config.ScriptSearchCriteria', 'config.Carrier',
    function ($scope, DashboardService, Service, Constants, $http, $location, $rootScope, ACLConfig, ScriptSearchCriteria, Carrier) {
		$scope.CSCreator = ACLConfig.isAppliedAclToUser('CreateCarrierScripts');
		$scope.CSReviewer = ACLConfig.isAppliedAclToUser('ReviewCarrierScripts');
		$scope.USCreator = ACLConfig.isAppliedAclToUser('CreateUniversalScripts');
		$scope.USReviewer = ACLConfig.isAppliedAclToUser('ReviewUniversalScripts');
		$scope.searchCriteria = new ScriptSearchCriteria();
		
		$scope.dashboardDetailsSuccess = function(data, status, headers, config) {
            $scope.dashboardDetails = data;
        };

        $scope.routeToConfig = function(index) {

            $rootScope.workflowDetails = $scope.dashboardDetails[index];
            if ($rootScope.workflowDetails.State == 'Approved' || $rootScope.workflowDetails.State == 'Rejected') {
                return;
            }
            $rootScope.loading = true;
            $scope.routingTo('/main/configuration', 1);
            $location.search('id', $rootScope.workflowDetails.VersionId);
        }

        $scope.error = function() {
            alert("Application Error Occurred. Please Contact Administrator");
        }

        if ($scope.CSCreator || $scope.CSReviewer || $scope.USCreator || $scope.USReviewer) {
			
			if ($scope.CSCreator || $scope.CSReviewer)
				$scope.ErrorType = 'C';
			else
				$scope.ErrorType = 'U';
			DashboardService.getErrorDashboardInfo($scope.dashboardDetailsSuccess, $scope.error, $scope.ErrorType);
		} else
			DashboardService.getDashboardDetails($scope.dashboardDetailsSuccess, $scope.error);	
		
        $scope.saveReadUnRead = function(index) {

            if ($rootScope.username == $scope.dashboardDetails[index].FromUserName) {
                return;
            }

            if (!$scope.dashboardDetails[index].IsUnread) {
                $scope.routeToConfig(index);
            } else {
                $scope.dashboardDetails[index].IsUnread = false;
                Service.httpCall('PUT', Constants.url.UpdateDashboardInfo + $scope.dashboardDetails[index].Id,
                    function (data) {
                        $scope.routeToConfig(index);
                    }, $scope.error, $scope.dashboardDetails[index]);
            }
        }

		$scope.navigateToErrorLocale = function(status, carrierCode, carrierId) {

				$scope.searchCriteria.IsUnRead = 1;
				if (status === "Approved")
					$scope.searchCriteria.Status = "APPROVED";
				else if (status === "Reviewed")
					$scope.searchCriteria.Status = "REVIEWED";
				else if (status === "Rejected")
					$scope.searchCriteria.Status = "REJECTED";
				else if (status === "Waiting For Approval")
					$scope.searchCriteria.Status = "WAITING_FOR_APPROVAL";
					
				$scope.carrier = new Carrier();
				$scope.carrier.Id = carrierId;
				$scope.carrier.Code = carrierCode;
				$scope.routeToErrorLocale($scope.carrier);
									
                //Service.httpCall('POST', Constants.url.GetAllError,
                //    function (data) {
                 //       $scope.routeToErrorLocale(index);
                 //   }, $scope.error, $scope.dashboardDetails[index]);
            
        }

		$scope.routeToErrorLocale = function(carrier) {
            
			if ($scope.USCreator || $scope.USReviewer)
				$scope.routingTo('/main/errorlocales', 1);
			else if ($scope.CSCreator || $scope.CSReviewer) {
				$scope.routingTo('/main/errorlocales', 2);					
			}
            $location.search('fromDashBoard', 1);
			$location.search('dashBoardStatus', $scope.searchCriteria.Status);
			$location.search('dashBoardCarrier', carrier);
        }
		
    }
]);