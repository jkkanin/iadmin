'use strict';

angular.module('config').controller('config.CarrierScriptsCtrl', ['$scope', 'config.Constants', 'config.Service',
    'config.ScriptSearchCriteria','config.Error','config.ConfiguredLanguages','config.Language',
    'config.ErrorLocaleDetail', 'config.ConfiguredCarriers', 'config.Carrier', 'config.Status', 'acl.ACLConfig', '$location', '$filter',
    function ($scope, Constants, Service, ScriptSearchCriteria, Error, ConfiguredLanguages, Language, ErrorLocaleDetail,
              ConfiguredCarriers, Carrier, Status, ACLConfig, $location, $filter) {

        $scope.existCode = false;
        $scope.allUniversalScripts = null;
        $scope.carriers = null;
        $scope.carrierLanguages = null;
        $scope.carrierLanguageList = null;
        $scope.currentCarrier = null;
        $scope.firsttime = false;
        $scope.chkAllCarrierScripts = false;
        $scope.scriptHeading = null;
        $scope.successMsg = "";
        $scope.selCarrierScriptIds = new Array();
        $scope.showCodeSearch = false;
        $scope.showDescSearch = false;
        $scope.searchCriteria = new ScriptSearchCriteria();
        $scope.allCarrierScripts = null;
        $scope.carrierScript = null;
        $scope.search = "";
        $scope.selScriptCode = null;
        $scope.administrator = ACLConfig.isAppliedAclToUser('ViewCarrierScripts');
        $scope.creator = ACLConfig.isAppliedAclToUser('CreateCarrierScripts');
        $scope.reviewer = ACLConfig.isAppliedAclToUser('ReviewCarrierScripts');
        $scope.readOnlyStatus = false;
        $scope.fromDash = false;
        $scope.hideReview = false;

        //get all universal scripts
        $scope.getAllUniversalScripts = function() {
            $scope.searchCriteria.ErrorType = "UNIVERSAL_SCRIPT";
            Service.httpCall('POST', Constants.url.GetAllError, $scope.getAllUniversalScriptsSuccess, $scope.error, $scope.searchCriteria);
        }

        //get all universal script success
        $scope.getAllUniversalScriptsSuccess = function(data) {
            $scope.allUniversalScripts = data;

            //get all carriers
            $scope.carriers = ConfiguredCarriers.getCarriers();
        }

        $scope.getAllUniversalScripts();

        //get universal script details by id
        $scope.getUniversalScript = function(id, status) {

            $scope.searchCriteria.ErrorId = id;
            $scope.searchCriteria.Status = status;
            return new Error(Service.httpCall("POST", Constants.url.GetError, $scope.getUniversalScriptSuccess, $scope.error, $scope.searchCriteria));
        }

        $scope.getUniversalScriptSuccess = function(data) {

            $scope.universalScript = data;
            $scope.carrierScript.Code = $scope.universalScript.Code;
            $scope.carrierScript.Description = $scope.universalScript.Description;

            $scope.universalScript.ErrorLocaleDetails.forEach(function(usErrorLocalDetail) {
                $scope.carrierScript.ErrorLocaleDetails.forEach(function(csErrorLocalDetail) {

                    if (csErrorLocalDetail.LanguageId === usErrorLocalDetail.LanguageId) {
                        csErrorLocalDetail.Value = usErrorLocalDetail.Value;
                    }
                });
            });
        }

        //show universal script by id
        $scope.showUniversalScriptDetails = function () {

            $scope.existCode = false;
            if (!$scope.copyFrom) {

                $scope.carrierScript.Code = "";
                $scope.carrierScript.Description = "";
                $scope.carrierScript.ErrorLocaleDetails.forEach(function(csErrorLocalDetail) {
                    csErrorLocalDetail.Value = "";
                });
                return;
            }
            $scope.getUniversalScript($scope.copyFrom.Id, $scope.copyFrom.Status.Status);
        }

        //show script box with sliding effect
        $scope.showSlidingScriptBox = function() {
            if ($('.sliding-body').css('display') === "block") {
                $('.sliding-header').toggle('slide');
                $('.sliding-body').toggle('slide');
                $scope.firsttime = false;
            }
            $('.sliding-header').toggle('slide');
            $('.sliding-body').toggle('slide');
        }

        //hide script box with sliding effect
        $scope.hideSlidingScriptBox = function() {
            $('.sliding-header').toggle('slide');
            $('.sliding-body').toggle('slide');
            $scope.firsttime = false;
        }

        //get all scripts by carrier id
        $scope.getCarrierScripts = function() {

            //hide all if current carrier is empty
            if (!$scope.currentCarrier) {

                $scope.allCarrierScripts = null;
                $scope.carrierLanguageList = null;
                $scope.selCarrierScriptIds = new Array();
                if ($('.sliding-body').css('display') === "block")
                    $scope.hideSlidingScriptBox();
                return;
            }

            $scope.carrierLanguages = arrayOfObjectToArrayOfPrototype(
                Service.ajaxCall("GET", Constants.url.GetAllLanguagesByCarrierId + "/" + $scope.currentCarrier.Id, false),
                function toLanguage (appPageData) {
                    return new Language(appPageData);
                });

            $scope.carrierLanguageList = "";
            $scope.carrierLanguages.forEach(function(language) {
                $scope.carrierLanguageList += ($scope.carrierLanguageList === "" ? "" : ", ");
                $scope.carrierLanguageList += language.Description;
            });
            $scope.getAllCarrierScripts();
        }

        //get all carrier scripts
        $scope.getAllCarrierScripts = function() {

            if ($location.search().fromDashBoard != 1) {
                $scope.searchCriteria.CarrierId = $scope.currentCarrier.Id;
                $scope.searchCriteria.ErrorType = null;
                $scope.fromDash = false;
                if ($scope.creator) {
                    $scope.searchCriteria.IsUnRead = 0;

                } else if ($scope.reviewer) {
                    $scope.searchCriteria.IsUnRead = 1;
                    $scope.searchCriteria.Status = "WAITING_FOR_APPROVAL";
                    $scope.searchCriteria.ErrorType = "CARRIER_SCRIPT";
                }
            } else {
                $scope.fromDash = true;
                $scope.searchCriteria.IsUnRead = 1;
                $scope.searchCriteria.CarrierId = $scope.currentCarrier.Id;
                $scope.searchCriteria.Status = $location.search().dashBoardStatus;
                $scope.searchCriteria.ErrorType = "CARRIER_SCRIPT";
            }
            Service.httpCall('POST', Constants.url.GetAllError, $scope.getAllCarrierScriptsSuccess, $scope.error, $scope.searchCriteria);
        }

        //get all carrier script success
        $scope.getAllCarrierScriptsSuccess = function(data) {
            $scope.allCarrierScripts = data;
            $scope.showCodeSearch = false;
            $scope.showDescSearch = false;
            $scope.search.Code = "";
            $scope.search.Description = "";
        }

        //get carrier script details by id
        $scope.getCarrierScript = function(id, status) {

            $scope.searchCriteria.ErrorId = id;
            $scope.searchCriteria.Status = status;
            Service.httpCall("POST", Constants.url.GetError, $scope.getCarrierScriptsSuccess, $scope.error, $scope.searchCriteria);
        }

        $scope.getCarrierScriptsSuccess = function(data) {

            $scope.carrierScript =  new Error(data);
            //add missed languages
            var exist = false;

			$scope.carrierScript.Carriers.forEach(function(carrier) {
				if ($scope.currentCarrier)
					$scope.currentCarrier.Description = carrier.Description;
			});
			
            $scope.carrierLanguages.forEach(function(language) {
                exist = false;
                $scope.carrierScript.ErrorLocaleDetails.forEach(function(scriptLanguage) {
                    if (language.Id === scriptLanguage.LanguageId)
                        exist = true;
                });

                if (!exist) {
                    $scope.errorLocaleDetail = new ErrorLocaleDetail();
                    $scope.errorLocaleDetail.LanguageId = language.getId();
                    $scope.errorLocaleDetail.Language = language.getDescription();
                    $scope.carrierScript.ErrorLocaleDetails.push($scope.errorLocaleDetail);
                }
            });

            var notExistIds = new Array();
            $scope.carrierScript.ErrorLocaleDetails.forEach(function(scriptLanguage) {
                exist = false;
                $scope.carrierLanguages.forEach(function(language) {
                    if (language.Id === scriptLanguage.LanguageId) {
                        exist = true;
                    }
                });

                if (!exist) {
                    var idx = $scope.carrierScript.ErrorLocaleDetails.indexOf(scriptLanguage);
                    notExistIds.push(idx);
                }
            });

            notExistIds.forEach(function(idx) {
                $scope.carrierScript.ErrorLocaleDetails.splice(idx, 1);
            });
            $scope.showSlidingScriptBox();
            setTimeout(function(){$('#' + $scope.focusControl).focus();},100);
        }
        //save carrier script
        $scope.saveCarrierScript = function(filterLength) {

            if (filterLength > 0 && $scope.carrierScript.Id === null) {
                $scope.existCode = true;
                return;
            }

            $scope.existCode = false;
            $scope.firsttime = true;
            if (!$scope.carrierScriptForm.$valid) {
                return;
            }
            $scope.carrierScript.Comments = null;
            if ($scope.carrierScript.Id === null)
                Service.httpCall('POST', Constants.url.saveError, $scope.addCarrierScriptsSuccess, $scope.error, new Array($scope.carrierScript));
            else
                Service.httpCall('POST', Constants.url.saveError, $scope.updateCarrierScriptsSuccess, $scope.error, new Array($scope.carrierScript));
        }

        //add carrier script success
        $scope.addCarrierScriptsSuccess = function(data) {
        	
        	if(data == "-1") {
        		
        		$scope.existCode = true;
        		return
        	}
            $scope.successMsg = "Added Successfully";
            $scope.carrierScript.Id = data[0];
            $scope.carrierScript.Status = new Status();
            $scope.carrierScript.Status.Status = "WAITING_FOR_APPROVAL";
            if ($scope.allCarrierScripts == null) {
                $scope.allCarrierScripts = new Array();
            }
            $scope.allCarrierScripts.unshift($scope.carrierScript);
            $scope.hideSlidingScriptBox();
            $scope.firsttime = false;
            $scope.scriptHeading = null;
            $scope.readOnlyStatus = false;
        }

        //update carrier script success
        $scope.updateCarrierScriptsSuccess = function(data) {
            $scope.successMsg = "Updated Successfully";
            var BreakException= {};
            try {
                $scope.allCarrierScripts.forEach(function(carrierScript) {
                    if (carrierScript.Id === $scope.carrierScript.Id
                        && carrierScript.Status.Status === $scope.carrierScript.Status.Status) {
                        if ($scope.fromDash)
                            $scope.allCarrierScripts.pop(carrierScript);
                        carrierScript.Description = $scope.carrierScript.Description;
                        carrierScript.Status.Status = "WAITING_FOR_APPROVAL";
                        carrierScript.Id = data[0];
                        throw BreakException;
                    }
                });
            } catch (e) {
                if (e!==BreakException) throw e;
            }
            $scope.hideSlidingScriptBox();
            $scope.firsttime = false;
            $scope.scriptHeading = null;
        }

        //show confirmation before remove carrier script
        $scope.showRemoveConfirmation = function() {
            $('#removeScriptModal').modal({
                keyboard: false,
                backdrop: 'static'
            });
        }

        //remove carrier script by ids
        $scope.removeCarrierScripts = function() {
            if ($('.sliding-body').css('display') === "block")
                $scope.hideSlidingScriptBox();
            Service.httpCall('POST', Constants.url.removeErrors, $scope.removeCarrierScriptsSuccess, $scope.error, $scope.selCarrierScriptIds);
        }

        //remove carrier script success
        $scope.removeCarrierScriptsSuccess = function(data) {

            $scope.selCarrierScriptIdsStr = ',' + $scope.selCarrierScriptIds.join(',') + ',';

            for (var i =  $scope.allCarrierScripts.length - 1; i > -1; i--) {
                if ($scope.selCarrierScriptIdsStr.indexOf($scope.allCarrierScripts[i].Id) > -1
                    && $scope.allCarrierScripts[i].Status.Status === 'APPROVED') {
                    $scope.allCarrierScripts[i].Status.Status = 'WAITING_FOR_APPROVAL';
                }
            }
            $scope.selCarrierScriptIds = new Array();
            $('td input:checkbox').filter(function() { return !this.disabled; }).attr('checked', false);
            $scope.successMsg = "Removed Successfully";
        }

        //cancel script addition/edition
        $scope.cancelCarrierScript = function(data) {
            $scope.successMsg = "";
            $scope.hideSlidingScriptBox();
            $scope.firsttime = false;
            $scope.scriptHeading = null;
            $scope.readOnlyStatus = false;
            $scope.copyFrom = null;
        }

        //show error message in case of bad response from the server
        $scope.error =  function() {
            alert("Application Error Occured");
        }

        //show search box in table
        $scope.showSearchBox = function ($event) {

            if ($event.target.nodeName === "DIV" || $event.target.nodeName === "H4") {
                $scope.showCodeSearch = false;
                $scope.showDescSearch = false;
                $scope.search.Code = "";
                $scope.search.Description = "";
            } else if ($event.target.id === "codeHeader" || $event.target.id === "codeHeaderLbl") {
                $scope.showCodeSearch = true;
                setTimeout(function(){$('#txtCode').focus();},100);
            }
            else if ($event.target.id === "descHeader" || $event.target.id === "descHeaderLbl") {
                $scope.showDescSearch = true;
                setTimeout(function(){$('#txtDesc').focus();},100);
            }
        };

        //fetch the carrier script details before show the details for addition/edition
        $scope.addCarrierScript = function(idx, comments, searchedCarrierScripts)  {

			$scope.index = idx;
			$scope.searchedCarrierScripts = searchedCarrierScripts;
            $scope.existCode = false;
            $scope.readOnlyStatus = false;
            $scope.Comments = comments;
            $scope.carrierLanguages = arrayOfObjectToArrayOfPrototype(
                Service.ajaxCall("GET", Constants.url.GetAllLanguagesByCarrierId + "/" + $scope.currentCarrier.Id, false),
                function toLanguage (appPageData) {
                    return new Language(appPageData);
                });

            $scope.focusControl = "copyFrom";
            if (idx === -1) {

                if ($scope.reviewer || $scope.creator || $scope.administrator)
                    $scope.hideReview = true;
                else
                    $scope.hideReview = false;
                $scope.scriptHeading = "Create Carrier Script";
                $scope.carrierScript = new Error();
                $scope.carrierScript.ErrorType = "CARRIER_SCRIPT";

                $scope.carrierLanguages.forEach(function(language) {
                    $scope.errorLocaleDetail = new ErrorLocaleDetail();
                    $scope.errorLocaleDetail.LanguageId = language.getId();
                    $scope.errorLocaleDetail.Language = language.getDescription();
                    $scope.carrierScript.ErrorLocaleDetails.push($scope.errorLocaleDetail);
                });

                $scope.newCarrier = new Carrier();
                $scope.newCarrier.Id = $scope.currentCarrier.Id;
                $scope.carrierScript.Carriers = new Array();
                $scope.carrierScript.Carriers.push($scope.newCarrier);
                $scope.showSlidingScriptBox();
                setTimeout(function(){$('#' + $scope.focusControl).focus();},100);
            } else {

                if (($scope.reviewer && (searchedCarrierScripts[idx].Status.Action == "REMOVE" || searchedCarrierScripts[idx].Status.Action == "ROLLBACK")) || $scope.creator || $scope.administrator)
                    $scope.hideReview = true;
                else
                    $scope.hideReview = false;
                $scope.focusControl = "description";
                $scope.scriptHeading = "Edit Carrier Script";
                if (searchedCarrierScripts[idx].Status.Status == "WAITING_FOR_APPROVAL" || searchedCarrierScripts[idx].Status.Status == "REJECTED")
                    $scope.readOnlyStatus = true;
                else
                    $scope.readOnlyStatus = false;
                $scope.getCarrierScript(searchedCarrierScripts[idx].Id, searchedCarrierScripts[idx].Status.Status);
            }
        };

        //get the selected carrier script ids
        $scope.getSelCarrierScriptIds = function ($event, searchedCarrierScripts) {
            if ($event.target.checked) {
                $scope.selCarrierScriptIds.push($event.target.id);
                $scope.selScriptCode = $event.target.value;
            } else {
                $scope.selCarrierScriptIds.splice($.inArray($event.target.id, $scope.selCarrierScriptIds),1);
                if ( $scope.selCarrierScriptIds.length == 1) {
                    var selectedScripts = $filter('filter')(searchedCarrierScripts, {Id : $scope.selCarrierScriptIds[0]});
                    if (selectedScripts && selectedScripts.length > 0 && selectedScripts[0]) {
                        $scope.selScriptCode = selectedScripts[0].Code;
                    }
                }
            }
            $scope.chkAllCarrierScripts = (searchedCarrierScripts.length === $scope.selCarrierScriptIds.length ? true : false);
        };

        //select all the carrier scripts
        $scope.selAllCarrierScripts = function ($event, searchedCarrierScripts) {

            $scope.selCarrierScriptIds = new Array();

            if ($event != null) {
                if (!$event.target.checked) {
                    $scope.selCarrierScriptIds = new Array();
                } else {
                    searchedCarrierScripts.forEach(function(carrierScript) {
                        if (carrierScript.ErrorType != "UNIVERSAL_SCRIPT" && $scope.creator && carrierScript.Status.Status == 'APPROVED')
                            $scope.selCarrierScriptIds.push(carrierScript.Id);
                    });
                }
                $('td input:checkbox').filter(function() { return !this.disabled; }).attr('checked', $event.target.checked);
            }
        }

        $scope.clearSearchFields = function () {
            $scope.chkAllCarrierScripts = false;
            $scope.selCarrierScriptIds = new Array();
            $scope.selScriptCode = null;
            $('td input:checkbox').filter(function() { return !this.disabled; }).attr('checked', false);
        };

        //update carrier script rolled back success
        $scope.updateRolledbackRow = function(data,histroy) {

			$scope.histroy = histroy;
            $scope.successMsg = "Rolled back successfully";
			var BreakException= {};
			try {
        	$scope.allCarrierScripts.forEach(function(carrierScript) {
                if (carrierScript.Id === $scope.histroy.AppErrorId) {
					if ($scope.fromDash)
						$scope.allCarrierScripts.pop(carrierScript);
                	carrierScript.Description = $scope.histroy.Description;
                	carrierScript.Status.Status = "WAITING_FOR_APPROVAL";
					carrierScript.Id = data[0];
					throw BreakException;
                }
             });
			 } catch (e) {
				if (e!==BreakException) throw e;
			 }
			 
           // $scope.carrierScript = data;
            $scope.firsttime = false;
            $scope.scriptHeading = null;
        };

        $scope.approverCarrierScript = function(status) {

			$scope.getCarrierScriptIsinWorkflow($scope.searchedCarrierScripts[$scope.index].Id, $scope.searchedCarrierScripts[$scope.index].Status.Status, status);
			
        };

        $scope.approveCarrierScriptsSuccess = function(data) {
            if ($scope.carrierScript.Status.Status == "APPROVED")
                $scope.successMsg = "Approved Successfully";
            else if ($scope.carrierScript.Status.Status == "REVIEWED")
                $scope.successMsg = "Reviewed Successfully";
            else
                $scope.successMsg = "Rejected Successfully";

            for (var i =  $scope.allCarrierScripts.length - 1; i > -1; i--) {
                if ($scope.allCarrierScripts[i].Id === $scope.carrierScript.Id) {
                    $scope.allCarrierScripts.splice(i, 1);
                }
            }

            $scope.hideSlidingScriptBox();
            $scope.firsttime = false;
            $scope.scriptHeading = null;
        };

        if ($location.search().dashBoardCarrier != 'undefined') {
            $scope.currentCarrier = $location.search().dashBoardCarrier;
            $scope.getCarrierScripts();
        }
		
		$scope.getCarrierScriptIsinWorkflow = function(id, status, selectedStatus) {
			$scope.searchCriteria.ErrorId = id;
            $scope.searchCriteria.Status = status;
			$scope.selectedStatus = selectedStatus;
            Service.httpCall("POST", Constants.url.GetError, $scope.getCarrierScriptIsinWorkflowSuccess, $scope.error, $scope.searchCriteria);
		};
		
		$scope.getCarrierScriptIsinWorkflowSuccess = function(data) {
			if (data != "")
				$scope.carrierScriptWF =  new Error(data);
			if ($scope.carrierScriptWF && $scope.carrierScriptWF.Status.Status == "WAITING_FOR_APPROVAL") {
				$scope.firsttime = true;
				if (!$scope.carrierScriptForm.$valid) {
					return;
				}
				$scope.carrierScript.Status.Status = $scope.selectedStatus;
				if (!($scope.carrierScript.Status.Action == "ROLLBACK" && $scope.carrierScript.Status.Status == "REJECTED"))
					$scope.carrierScript.Status.Action = null;
				Service.httpCall('POST', Constants.url.updateAppErrorStatus, $scope.approveCarrierScriptsSuccess, $scope.error, new Array($scope.carrierScript));
			} else {
				if (!$scope.carrierScriptWF ) {
					$scope.successMsg = "Already Approved";						
				} else if ($scope.carrierScriptWF && $scope.carrierScriptWF.Status != null && $scope.carrierScriptWF.Status.Status != "WAITING_FOR_APPROVAL") {
					if ($scope.carrierScriptWF.Status.Status == "REJECTED") {
						$scope.successMsg = "Already Rejected";						
					}
					if ($scope.carrierScriptWF.Status.Status == "REVIEWED") {
						$scope.successMsg = "Already Reviewed";						
					}
					for (var i =  $scope.allCarrierScripts.length - 1; i > -1; i--) {
						if ($scope.allCarrierScripts[i].Id === $scope.carrierScript.Id) {
							$scope.allCarrierScripts.splice(i, 1);
						}
					}
					$scope.hideSlidingScriptBox();
					return;
				} 
			}
		};
    }
]);