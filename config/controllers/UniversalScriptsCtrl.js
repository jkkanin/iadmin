'use strict';

angular.module('config').controller('config.UniversalScriptsCtrl', ['$scope', 'config.Constants', 'config.Service',
    'config.ScriptSearchCriteria','config.Error','config.ConfiguredLanguages','config.Language', 
    'config.ErrorLocaleDetail', 'config.ConfiguredCarriers', 'config.Status', 'acl.ACLConfig', '$location', '$filter',
    function ($scope, Constants, Service, ScriptSearchCriteria, Error, ConfiguredLanguages, Language, ErrorLocaleDetail,
    		ConfiguredCarriers, Status, ACLConfig, $location, $filter) {

		$scope.existCode = false;
		$scope.firsttime = false;
		$scope.chkAllUniversalScripts = false;
		$scope.scriptHeading = null;
		$scope.successMsg = "";
		$scope.selUniversalScriptIds = new Array();
		$scope.showCodeSearch = false;
		$scope.showDescSearch = false;
		$scope.searchCriteria = new ScriptSearchCriteria();
		$scope.allUniversalScripts = null;		
		$scope.universalScript = null;
		$scope.availableCarriers = new Array();
		$scope.search = "";
		$scope.selScriptCode = null;
		$scope.administrator = ACLConfig.isAppliedAclToUser('ViewUniversalScripts');
		$scope.creator = ACLConfig.isAppliedAclToUser('CreateUniversalScripts');
		$scope.reviewer = ACLConfig.isAppliedAclToUser('ReviewUniversalScripts');
		$scope.readOnlyStatus = false;
		$scope.fromDash = false;
		$scope.hideReview = false;
		
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
		
		//get all universal scripts
		$scope.getAllUniversalScripts = function() {
			
			if ($location.search().fromDashBoard != 1) {
				$scope.searchCriteria.ErrorType = "UNIVERSAL_SCRIPT";
				$scope.fromDash = false;
				if ($scope.creator) {
					$scope.searchCriteria.IsUnRead = 0;
				} else if ($scope.reviewer) {
					$scope.searchCriteria.IsUnRead = 1;
					$scope.searchCriteria.Status = "WAITING_FOR_APPROVAL";
				}
			} else {
				$scope.fromDash = true;
				$scope.searchCriteria.IsUnRead = 1;
				$scope.searchCriteria.Status = $location.search().dashBoardStatus;
			}
            Service.httpCall('POST', Constants.url.GetAllError, $scope.getAllUniversalScriptsSuccess, $scope.error, $scope.searchCriteria);
        }

		//get all universal script success
        $scope.getAllUniversalScriptsSuccess = function(data) {
        	 $scope.allUniversalScripts = data;
        }
        
		$scope.getAllUniversalScripts();
        
        //get universal script details by id
        $scope.getUniversalScript = function(id, status) {

			$scope.searchCriteria.ErrorId = id;
			$scope.searchCriteria.Status = status;
            return new Error(Service.httpCall("POST", Constants.url.GetError, $scope.getUniversalScriptsSuccess, $scope.error, $scope.searchCriteria));
        }
        
		$scope.getUniversalScriptsSuccess = function(data) {
        	 $scope.universalScript =  new Error(data);
        	//add missed languages
     		$scope.allLanguages = ConfiguredLanguages.getLanguages();
     		var exist = false;
     		
     		$scope.allLanguages.forEach(function(language) {
     			exist = false;
     			$scope.universalScript.ErrorLocaleDetails.forEach(function(scriptLanguage) {
         			if (language.Id === scriptLanguage.LanguageId)
                         	exist = true;
                 });
     			
     			if (!exist) {
                 	$scope.errorLocaleDetail = new ErrorLocaleDetail();
                     $scope.errorLocaleDetail.LanguageId = language.getId();
                     $scope.errorLocaleDetail.Language = language.getDescription();
                     $scope.universalScript.ErrorLocaleDetails.push($scope.errorLocaleDetail);
                 } 
             });
     		
     		var notExistIds = new Array();
             $scope.universalScript.ErrorLocaleDetails.forEach(function(scriptLanguage) {
                 exist = false;
                 $scope.allLanguages.forEach(function(language) {
                     if (language.Id === scriptLanguage.LanguageId) {
                         exist = true;
                     }
                 });

                 if (!exist) {
                     var idx = $scope.universalScript.ErrorLocaleDetails.indexOf(scriptLanguage);
                     notExistIds.push(idx);
                 }
             });

             notExistIds.forEach(function(idx) {
                 $scope.universalScript.ErrorLocaleDetails.splice(idx, 1);
             });
     		
     		//add missed carriers
     		$scope.allCarriers = ConfiguredCarriers.getCarriers();
     		var exist = false;
     		
     		$scope.allCarriers.forEach(function(carrier) {
     			exist = false;
     			$scope.universalScript.Carriers.forEach(function(scriptCarrier) {
         			if (carrier.Id === scriptCarrier.Id)
                         	exist = true;
                 });
     			
     			if (!exist) {
     				$scope.availableCarriers.push(carrier);
                 } 
             });
     		
     		var notExistIds = new Array();
             $scope.universalScript.Carriers.forEach(function(scriptCarrier) {
                 exist = false;
                 $scope.allCarriers.forEach(function(carrier) {
                     if (carrier.Id === scriptCarrier.Id) {
                         exist = true;
                     }
                 });

                 if (!exist) {
                     var idx = $scope.universalScript.Carriers.indexOf(scriptLanguage);
                     notExistIds.push(idx);
                 }
             });

             notExistIds.forEach(function(idx) {
                 $scope.universalScript.Carriers.splice(idx, 1);
             });
             $scope.showSlidingScriptBox();
         	setTimeout(function(){$('#' + $scope.focusControl).focus();},100);
        }
        //save universal script
        $scope.saveUniversalScript = function(filterLength) {
			
        	if (filterLength > 0 && $scope.universalScript.Id === null) {
        		$scope.existCode = true;
        		return;
        	}
        	
        	$scope.existCode = false;
        	$scope.firsttime = true;
        	if (!$scope.universalScriptForm.$valid || $scope.universalScript.Carriers.length === 0) {
        		return;
        	}
			$scope.universalScript.Comments = null;
        	if ($scope.universalScript.Id === null)
        		Service.httpCall('POST', Constants.url.saveError, $scope.addUniversalScriptsSuccess, $scope.error, new Array($scope.universalScript));
        	else
        		Service.httpCall('POST', Constants.url.saveError, $scope.updateUniversalScriptsSuccess, $scope.error, new Array($scope.universalScript));        	
        }

        //add universal script success
        $scope.addUniversalScriptsSuccess = function(data) {
        	
        	if(data == -1) {

        		$scope.existCode = true;
        		
        	} else {

            	$scope.successMsg = "Added Successfully";
            	$scope.universalScript.Id = data[0];
            	$scope.universalScript.Status = new Status();
            	$scope.universalScript.Status.Status = "WAITING_FOR_APPROVAL";
            	if ($scope.allUniversalScripts == null) {
            		$scope.allUniversalScripts = new Array();
            	}
            	$scope.allUniversalScripts.unshift($scope.universalScript);
            	$scope.hideSlidingScriptBox();  	
            	$scope.firsttime = false;
            	$scope.scriptHeading = null;
    			$scope.readOnlyStatus = false;
        	}

        }

        //update universal script success
        $scope.updateUniversalScriptsSuccess = function(data) {
		
        	$scope.successMsg = "Updated Successfully";
			var BreakException= {};
			try {
        	$scope.allUniversalScripts.forEach(function(universalScript) {
                if (universalScript.Id === $scope.universalScript.Id
                		&& universalScript.Status.Status === $scope.universalScript.Status.Status) {
					if ($scope.fromDash)
						$scope.allUniversalScripts.pop(universalScript);
                	universalScript.Description = $scope.universalScript.Description;
                	universalScript.Status.Status = "WAITING_FOR_APPROVAL";
					universalScript.Id = data[0];
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
        
        //show confirmation before remove universal script
        $scope.showHistory = function() {
        	$('#removeScriptModal').modal({
      		  keyboard: false,
      		  backdrop: 'static'
        	});
        }
        
        //show confirmation before remove universal script
        $scope.showRemoveConfirmation = function() {
        	$('#removeScriptModal').modal({
      		  keyboard: false,
      		  backdrop: 'static'
        	});
        }

        //remove universal script by ids
        $scope.removeUniversalScripts = function() {
        	if ($('.sliding-body').css('display') === "block") 
        		$scope.hideSlidingScriptBox();
			Service.httpCall('POST', Constants.url.removeErrors, $scope.removeUniversalScriptsSuccess, $scope.error, $scope.selUniversalScriptIds);
        }

        //remove universal script success
        $scope.removeUniversalScriptsSuccess = function(data) {
        	
        	$scope.selUniversalScriptIdsStr = ',' + $scope.selUniversalScriptIds.join(',') + ',';
			for (var i =  $scope.allUniversalScripts.length - 1; i > -1; i--) {        		
        		if ($scope.selUniversalScriptIdsStr.indexOf($scope.allUniversalScripts[i].Id) > -1
        				&& $scope.allUniversalScripts[i].Status.Status === 'APPROVED') {
        			$scope.allUniversalScripts[i].Status.Status = 'WAITING_FOR_APPROVAL';              	
                }
        	}
        	$scope.selUniversalScriptIds = new Array();
        	$('td input:checkbox').filter(function() { return !this.disabled; }).attr('checked', false);
        	$scope.successMsg = "Removed Successfully";
        }
        
        //cancel script addition/edition
        $scope.cancelUniversalScript = function(data) {
        	$scope.successMsg = "";        	
        	$scope.hideSlidingScriptBox();
        	$scope.firsttime = false;
        	$scope.scriptHeading = null;
			$scope.readOnlyStatus = false;
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
        
        //fetch the universal script details before show the details for addition/edition
        $scope.addUniversalScript = function(idx, comments, searchedUniversalScripts)  {

			$scope.index = idx;
			$scope.searchedUniversalScripts = searchedUniversalScripts;
        	$scope.existCode = false;
			$scope.readOnlyStatus = false;
        	$scope.availableCarriers = new Array();
        	$scope.focusControl = "code";
			$scope.Comments = comments;
        	if (idx === -1) {

				if ($scope.reviewer || $scope.creator || $scope.administrator)
					$scope.hideReview = true;
				else
					$scope.hideReview = false;
        		$scope.scriptHeading = "Create Universal Script";
        		$scope.universalScript = new Error();
        		$scope.universalScript.ErrorType = "UNIVERSAL_SCRIPT";

            	$scope.allLanguages = ConfiguredLanguages.getLanguages();
            	$scope.allLanguages.forEach(function(language) {
                    $scope.errorLocaleDetail = new ErrorLocaleDetail();
                    $scope.errorLocaleDetail.LanguageId = language.getId();
                    $scope.errorLocaleDetail.Language = language.getDescription();
                    $scope.universalScript.ErrorLocaleDetails.push($scope.errorLocaleDetail); 
                });
            	
            	$scope.universalScript.Carriers = ConfiguredCarriers.getCarriers();
            	$scope.showSlidingScriptBox();
            	setTimeout(function(){$('#' + $scope.focusControl).focus();},100);
        	} else {
				if (($scope.reviewer && (searchedUniversalScripts[idx].Status.Action == "REMOVE" || searchedUniversalScripts[idx].Status.Action == "ROLLBACK")) || $scope.creator || $scope.administrator)
					$scope.hideReview = true;
				else
					$scope.hideReview = false;
        		$scope.focusControl = "description";
        		$scope.scriptHeading = "Edit Universal Script";				
				if (searchedUniversalScripts[idx].Status.Status == "WAITING_FOR_APPROVAL" || searchedUniversalScripts[idx].Status.Status == "REJECTED")
					$scope.readOnlyStatus = true;
				else
					$scope.readOnlyStatus = false;
        		$scope.getUniversalScript(searchedUniversalScripts[idx].Id, searchedUniversalScripts[idx].Status.Status);        		
        	}
        };

        //get the selected universal script ids
        $scope.getSelUniversalScriptIds = function ($event, searchedUniversalScripts) {        	
        	if ($event.target.checked) {
        		$scope.selUniversalScriptIds.push($event.target.id);
        		$scope.selScriptCode = $event.target.value;
        	} else {
        		$scope.selUniversalScriptIds.splice($.inArray($event.target.id, $scope.selUniversalScriptIds),1);
                if ( $scope.selUniversalScriptIds.length == 1) {
                    var selectedScripts = $filter('filter')(searchedUniversalScripts, {Id : $scope.selUniversalScriptIds[0]});
                    if (selectedScripts && selectedScripts.length > 0 && selectedScripts[0]) {
                        $scope.selScriptCode = selectedScripts[0].Code;
                    }
                }
        	}        	
        	$scope.chkAllUniversalScripts = (searchedUniversalScripts.length === $scope.selUniversalScriptIds.length ? true : false);        		
        };
        
        //select all the universal scripts
        $scope.selAllUniversalScripts = function ($event, searchedUniversalScripts) {
        	$scope.selUniversalScriptIds = new Array();
			if ($event != null) {
				if (!$event.target.checked) {
					$scope.selUniversalScriptIds = new Array();
				} else {
					searchedUniversalScripts.forEach(function(universalScript) {
					
						if (($scope.creator && universalScript.Status.Status == 'APPROVED'))
							$scope.selUniversalScriptIds.push(universalScript.Id);
		            });
				}
				$('td input:checkbox').filter(function() { return !this.disabled; }).attr('checked', $event.target.checked);
			}
        }
        
        $scope.clearSearchFields = function () {        	
        	$scope.chkAllUniversalScripts = false;
			$scope.selUniversalScriptIds = new Array();
			$scope.selScriptCode = null;
			$("td input:checkbox").prop("checked", false);
        };
        
        //move carrier from one list to another list
		
		$scope.moveItem = function(item, from, to, isAdd) {

			for (var i=0;i<item.length;i++) {
			
				if (from.indexOf(item[i]) != -1) {
					from.splice(from.indexOf(item[i]), 1);
					to.push(item[i]);
				}
			}
        };

        //update universal script rolled back success
        $scope.updateRolledbackRow = function(data, histroy) {
        	
			$scope.histroy = histroy;
			$scope.successMsg = "Rolled back successfully";
			var BreakException= {};
			try {
        	$scope.allUniversalScripts.forEach(function(universalScript) {
                if (universalScript.Id === $scope.histroy.AppErrorId) {
					if ($scope.fromDash)
						$scope.allUniversalScripts.pop(universalScript);
                	universalScript.Description = $scope.histroy.Description;
                	universalScript.Status.Status = "WAITING_FOR_APPROVAL";
					universalScript.Id = data[0];
					throw BreakException;
                }
             });
			 } catch (e) {
				if (e!==BreakException) throw e;
			 }
        	$scope.firsttime = false;
        	$scope.scriptHeading = null;
        };
		
		$scope.approverUniversalScript = function(status) {

			$scope.getUniversalScriptIsinWorkflow($scope.searchedUniversalScripts[$scope.index].Id, $scope.searchedUniversalScripts[$scope.index].Status.Status, status);
        };
		
		$scope.approveUniversalScriptsSuccess = function(data) {
			if ($scope.universalScript.Status.Status == "APPROVED")
				$scope.successMsg = "Approved Successfully";
			else if ($scope.universalScript.Status.Status == "REVIEWED")
				$scope.successMsg = "Reviewed Successfully";
			else
				$scope.successMsg = "Rejected Successfully";
			
			for (var i =  $scope.allUniversalScripts.length - 1; i > -1; i--) {        		
        		if ($scope.allUniversalScripts[i].Id === $scope.universalScript.Id) {
        			$scope.allUniversalScripts.splice(i, 1);                	
                }
        	}

			$scope.hideSlidingScriptBox();  	
        	$scope.firsttime = false;
        	$scope.scriptHeading = null;
        };
		
		$scope.getUniversalScriptIsinWorkflow = function(id, status, selectedStatus) {
			$scope.searchCriteria.ErrorId = id;
            $scope.searchCriteria.Status = status;
			$scope.selectedStatus = selectedStatus;
            Service.httpCall("POST", Constants.url.GetError, $scope.getUniversalScriptIsinWorkflowSuccess, $scope.error, $scope.searchCriteria);
		};
		
		$scope.getUniversalScriptIsinWorkflowSuccess = function(data) {
			if (data != "")
				$scope.universalScriptWF =  new Error(data);
			if ($scope.universalScriptWF && $scope.universalScriptWF.Status.Status == "WAITING_FOR_APPROVAL") {
				$scope.firsttime = true;
				if (!$scope.universalScriptForm.$valid || $scope.universalScript.Carriers.length === 0) {
					return;
				}
				$scope.universalScript.Status.Status = $scope.selectedStatus;
				if (!($scope.universalScript.Status.Action == "ROLLBACK" && $scope.universalScript.Status.Status == "REJECTED"))
					$scope.universalScript.Status.Action = null;
				Service.httpCall('POST', Constants.url.updateAppErrorStatus, $scope.approveUniversalScriptsSuccess, $scope.error, new Array($scope.universalScript));
			} else {
				if (!$scope.universalScriptWF ) {
					$scope.successMsg = "Already Approved";						
				} else if ($scope.universalScriptWF && $scope.universalScriptWF.Status != null && $scope.universalScriptWF.Status.Status != "WAITING_FOR_APPROVAL") {
					if ($scope.universalScriptWF.Status.Status == "REJECTED") {
						$scope.successMsg = "Already Rejected";						
					}
					if ($scope.universalScriptWF.Status.Status == "REVIEWED") {
						$scope.successMsg = "Already Reviewed";						
					}
					for (var i =  $scope.allUniversalScripts.length - 1; i > -1; i--) {
						if ($scope.allUniversalScripts[i].Id === $scope.universalScript.Id) {
							$scope.allUniversalScripts.splice(i, 1);
						}
					}
					$scope.hideSlidingScriptBox();
					return;
				} 
			}
		};
    }
]);