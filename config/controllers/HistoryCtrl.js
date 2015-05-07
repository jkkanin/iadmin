'use strict';

angular.module('config').controller('config.HistoryCtrl', ['$scope', 'config.Service', 'config.Constants', '$rootScope',
	function ($scope, Service, Constants, $rootScope) {

        $scope.histories = [];

        //get history by id success
        $scope.getHistorySuccess = function(data) {
            $scope.histories = data;
        }

        //get history by id
		$scope.getHistory = function() {
			
			$scope.errorId = null;
			if (angular.isDefined($scope.selCarrierScriptIds) && $scope.selCarrierScriptIds.length > 0)
				$scope.errorId = $scope.selCarrierScriptIds[0];
			else if (angular.isDefined($scope.selUniversalScriptIds) && $scope.selUniversalScriptIds.length > 0)
				$scope.errorId = $scope.selUniversalScriptIds[0];
			Service.httpCall('GET', Constants.url.GetAllErrorHistory + "/" + $scope.errorId, $scope.getHistorySuccess, $scope.error);
        }

        $scope.getHistory();

        $scope.toggleDetail = function($index) {
            $scope.activePosition = $scope.activePosition == $index ? -1 : $index;
        };

        $scope.closeModal = function() {
            if ($('body').find('#historyModal') && $('body').find('#historyModal').length > 0) {
                $('body').find('#historyModal').remove();
            }
            $rootScope.$broadcast('modalClose');
            $('#historyModalPanel').modal('hide');
        }

        $scope.rollback = function() {

        	if ($scope.historyId) {
				$scope.histories.forEach(function(history) {				
				
					if (history.Id == $scope.historyId) {
					
						$rootScope.history = history;
						Service.httpCall('POST', Constants.url.saveErrorHistory, $scope.saveErrorHistorySuccess, $scope.error, new Array(history));
					}
					
				});
        	}
        }

        $scope.saveErrorHistorySuccess = function(data) {

			$scope.closeModal();
			$scope.updateRolledbackRow(data,$rootScope.history);			
        }
		//roll back history id success
		$scope.rollbackSuccess = function(data) {

			$scope.updateRolledbackRow(data);
			$scope.closeModal();
        }

        //show confirmation before roll back universal script history
        $scope.showRollbackConfirmation = function() {
        	$('#rollbackHistoryModal').modal({
      		  keyboard: false,
      		  backdrop: 'static'
        	});
        }

    }
]);
