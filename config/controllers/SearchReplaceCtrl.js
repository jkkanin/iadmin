'use strict';

angular.module('config').controller('config.SearchReplaceCtrl', ['$scope', 'config.Service', 'config.Constants', 'config.Language', '$rootScope',
	'config.ScriptSearchCriteria', 'config.Error', 'config.ConfiguredLanguages',
    function ($scope, Service, Constants,  Language, $rootScope, ScriptSearchCriteria, Error, ConfiguredLanguages) {

        $scope.searchCriteria = null;
		$scope.firsttime = false;
		$scope.replaceLocale = false;
		$scope.searchResults = null;
		$scope.successMsg = null;

		$scope.getCarrierLanguages = function() {
            Service.httpCall("GET", Constants.url.GetAllLanguagesByCarrierId + "/" + currentCarrier.Id, $scope.getCarrierLanguagesSuccess, $scope.error);
        }

        $scope.getCarrierLanguagesSuccess = function(data, status, headers, config) {

            $scope.carrierLanguages = arrayOfObjectToArrayOfPrototype(data,
                function toLanguage(languageData) {
                    return new Language(languageData);
                });
        }

		$scope.searchCarrierScripts = function() {
			
			$scope.firsttime = true;
			if (!$scope.searchReplaceForm.$valid) {
				return;
			}
				
			$scope.searchCriteria = new ScriptSearchCriteria();
			$scope.searchCriteria.CarrierId = $scope.currentCarrier.getId();
			$scope.searchCriteria.LanguageId = $scope.selectedLanguage.getId();
			$scope.searchCriteria.Value = $scope.searchTxt;
			$scope.searchCriteria.Status = "APPROVED"
            Service.httpCall('POST', Constants.url.GetAllError, $scope.searchCarrierScriptsSuccess, $scope.error, $scope.searchCriteria);
        }
		
		$scope.searchCarrierScriptsSuccess = function(data) {
        	$scope.searchResults = data;
        }
		
		//show confirmation before remove universal script
        $scope.showReplaceConfirmation = function() {
        	
        	if (!$scope.replaceTxt) {
				$scope.replaceLocale = true;
				return;
			}

        	$('#replaceLocaleModal').modal({
      		  keyboard: false,
      		  backdrop: 'static'
        	});
        }
		
		$scope.replaceCarrierScripts = function() {

			$scope.searchResults.forEach(function(carrierScript) {				
				carrierScript.ErrorLocaleDetails.forEach(function(ErrorLocaleDetail) {	
					if ($scope.selectedLanguage.getId() === ErrorLocaleDetail.LanguageId) {
						$scope.regex = new RegExp($scope.searchTxt, 'g'); 
						ErrorLocaleDetail.Value = ErrorLocaleDetail.Value.replace($scope.regex, $scope.replaceTxt);
					}
	            });
            });
			Service.httpCall('POST', Constants.url.saveError, $scope.replaceCarrierScriptsSuccess, $scope.error, $scope.searchResults);
        }
		
		$scope.replaceCarrierScriptsSuccess = function () {
			$scope.searchResults = null;
			$scope.successMsg = "Replaced Successfully";
		}
		
		$scope.toggleDetail = function($index) {
	        $scope.activePosition = $scope.activePosition == $index ? -1 : $index;
	    };

        $scope.closeModal = function() {
            if ($('body').find('#searchModal') && $('body').find('#searchModal').length > 0) {
                $('body').find('#searchModal').remove();
            }
            $rootScope.$broadcast('modalClose');
            $('#searchModalPanel').modal('hide');
        }
    }
]);
