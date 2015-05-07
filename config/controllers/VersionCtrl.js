'use strict';

angular.module('config').controller('config.VersionCtrl', ['$scope', 'config.ConfiguredVersions', 'config.Service',
    'config.Constants', 'config.AppConfiguration',  'acl.ACLConfig', '$location', 'config.Version',
    function ($scope, ConfiguredVersions, Service, Constants, AppConfiguration, ACLConfig, $location, Version) {

        $scope.creator = ACLConfig.isAppliedAclToUser('CreateConfiguration');
        $scope.reviewer = ACLConfig.isAppliedAclToUser('ReviewConfiguration');
        $scope.seenReviewed = false;
        $scope.disableSave = true;
        $scope.breadCrumbPaneList = [];
        $scope.showError = false;

        var id = $location.search().id;

        $scope.saved = false;
        $scope.separator = " - ";

        $scope.setSelectedValue = function(id, dropDownClass, collection, datamodel) {

            $scope[collection].forEach(function(model) {
                if (model.getId() == id) {
                    $scope[datamodel] = model;

                    switch (dropDownClass) {

                        case "Version" :
                            $('.' + dropDownClass).html(model.Description + $scope.separator + model.Version);
                            break;
                        case "Wizard" :
                            $('.' + dropDownClass).html(
                                $scope.getAppConfigurationsById($scope.appWizards, model.AppWizardId).Description);
                            break;
                        case "Page" :
                            var appPage = $scope.getAppConfigurationsById($scope.appPages, model.AppPageId);
                            $('.' + dropDownClass).html(appPage.Name + $scope.separator + appPage.Description);
                            break;
                        case "SubPage" :
                        	var subPageName = model.Name + $scope.separator + model.Description;
                            $('.' + dropDownClass).html(subPageName.substr(0, 32) + '...');
                            break;
                    }
                }
            })
        }

        $scope.setDefaultValue = function(model) {
            $('.' + model).html('Choose ' + model);
        }

        $scope.cancel = function() {
            $scope.loadVersion();
            $scope.selectedVersion = null;
        }

        $scope.$watch('selectedVersion', function(newVersion, oldVersion) {

            $scope.saved = false;
            if (newVersion != oldVersion) {

                if (newVersion) {

                    if ($scope.seenReviewed) {
                        $scope.getConfiguration(true);
                        $scope.setSelectedValue($scope.selectedVersion.Id, 'Version', 'versions', 'selectedVersion');
                    } else {
                        Service.httpCall("GET", Constants.url.CanCreateNewVersion + "/" + newVersion.getId(),
                            $scope.getConfiguration,  $scope.error);
                    }
                } else {
                    $scope.setDefaultValue('Version');
                    $scope.wizards = [];
                    $scope.selectedWizard = null;
                    $scope.disableSave = true;
                }
            }
        });

        $scope.getConfiguration = function(data) {

            if (data == 'false') {
                $scope.selectedVersion = null;
                $scope.showError = true;
                $scope.disableSave = true;
                return;
            }

            $scope.showError = false;
            Service.httpCall("GET"
                , Constants.url.GetConfiguration + $scope.selectedVersion.getId(), $scope.loadWizard,  $scope.error);
            $scope.setDefaultValue('Wizard');
            $scope.clonedVersion =  angular.copy($scope.selectedVersion);
            $scope.disableSave = false;
        }

        $scope.loadVersion = function() {
            $scope.breadCrumbPaneList = [];
            if (id) {

                Service.httpCall("GET", Constants.url.GetVersionById + '/' + id, function(data) {

                    $scope.versions = [];
                    $scope.versions.push(new Version(data));
                    $scope.selectedVersion = $scope.versions[0];
                    $scope.seenReviewed = true;
                    $scope.comment = $scope.workflowDetails.Comment;
                    $scope.breadCrumbPaneList = [];
                },  $scope.error);
            } else {
                $scope.versions = ConfiguredVersions.getVersions();
            }
            $scope.configError = false;
        }

        $scope.loadVersion();

        $scope.loadWizard = function(data, status, headers, config) {

            $scope.selectedVersion.setWizards(data.Version.Wizards);
            if (!$scope.selectedVersion.Wizards) {
                $scope.selectedVersion.Wizards = [];
            }
            $scope.wizards = $scope.selectedVersion.getWizards();
            $scope.appWizards = AppConfiguration.getAppWizards();
        }

        $scope.getAppConfigurationsById = function(collection, id) {

            var returnModel;
            collection.forEach(function(model) {
                if (model.getId() == id) {
                    returnModel = model;
                }
            });

            return returnModel;
        }

        $scope.loadAppWizard = function(wizard) {
            if (!wizard || !wizard.getAppWizardId()) {
                 return;
            }
            $scope.selectedAppWizard = $scope.getAppConfigurationsById($scope.appWizards, wizard.getAppWizardId());
            $scope.appPages = AppConfiguration.getAppPagesByAppWizardId(wizard.getAppWizardId());
        }

        $scope.$watch('selectedWizard', function(newWizard, oldWizard) {

            if (newWizard != oldWizard) {

                if (newWizard) {

                    if (!newWizard.Pages) {
                        newWizard.Pages = [];
                    }
                    $scope.pages = newWizard.getPages();
                    $scope.loadAppWizard(newWizard);
                    $scope.setDefaultValue('Page');
                    $scope.editableWizard = newWizard;
                    $scope.clonedWizard =  angular.copy($scope.editableWizard);
                    $scope.breadCrumbPaneList = [];
                } else {

                    $scope.setDefaultValue('Wizard');
                    $scope.pages = [];
                }
                $scope.selectedPage = null;
                $scope.configError = false;
            }
        });


        $scope.loadAppPage = function(page) {

            if (!page || !page.getAppPageId()) {
                return;
            }
            $scope.selectedAppPage = $scope.getAppConfigurationsById($scope.appPages, page.getAppPageId());
            $scope.appFields = AppConfiguration.getAppFieldsByAppPageId(page.getAppPageId());
        }

        $scope.$watch('selectedPage', function(newPage, oldPage) {

            if (newPage != oldPage) {
                if (newPage) {

                    if (!newPage.SubPages) {
                        newPage.SubPages = [];
                    }
                    $scope.subPages = newPage.getSubPages();
                    $scope.loadAppPage(newPage);
                    $scope.setDefaultValue('SubPage');
                    $scope.editablePage = newPage;
                    $scope.clonedPage =  angular.copy($scope.editablePage);
                    $scope.breadCrumbPaneList = [];
                } else {

                    $scope.setDefaultValue('Page');
                    $scope.subPages = [];
                }
                $scope.selectedSubPage = null;
                $scope.configError = false;
            }
        });

        $scope.$watch('selectedSubPage', function(newSubPage, oldSubPage) {

            if (newSubPage != oldSubPage) {
                if (newSubPage) {

                    if (!newSubPage.Panes) {
                        newSubPage.Panes = [];
                    }
                    $scope.panes = newSubPage.getPanes();
                    $scope.editableSubPage = newSubPage;
                    $scope.clonedSubPage =  angular.copy($scope.editableSubPage);
                    $scope.breadCrumbPaneList = [];
                } else {

                    $scope.setDefaultValue('SubPage');
                    $scope.panes = [];
                    $scope.fields = [];
                    $scope.breadCrumbPaneList = [];
                }
                $scope.configError = false;
            }
        });

        $scope.$watch('selectedPane', function(newPane, oldPane) {

            if (newPane != oldPane) {
                if (newPane) {
                    if (!newPane.Fields) {
                        newPane.Fields = [];
                    }
                    if (!newPane.Panes) {
                        newPane.Panes = [];
                    }

                    $scope.panes = $scope.selectedPane.getPanes();
                    $scope.fields = newPane.getFields();
                    $scope.editablePane = newPane;
                    $scope.clonedPane =  angular.copy($scope.editablePane);
                } else {
                    $scope.fields = [];
                }

                $scope.setBreadCrumbMenu();
                $scope.selectedField = null;
                $scope.configError = false;
            }
        });

        $scope.setBreadCrumbMenu = function() {
            if ($scope.selectedPane) {
                $scope.breadCrumbPaneList.push($scope.selectedPane);
            }
        }

        $scope.navigateFromBreadCrumbs = function(pane, index) {

            if (pane) {

                var length = $scope.breadCrumbPaneList.length;
                for (var j = length - 1; j >= index; j--) {
                    $scope.breadCrumbPaneList.pop();
                }

                $scope.selectedPane = pane;
            } else {
                $scope.panes = $scope.selectedSubPage.getPanes();
                $scope.selectedPane = null;
                $scope.breadCrumbPaneList = [];
            }
        }

        $scope.resetFields = function() {
            $scope.fields = [];
        }

        $scope.$watch('selectedField', function(newField, oldField) {

            if (newField != oldField) {
                if (newField) {
                    $scope.selectedAppField = $scope.getAppConfigurationsById($scope.appFields, newField.getAppFieldId());
                    $scope.editableField = newField;
                    $scope.clonedField =  angular.copy($scope.editableField);
                } else {
                    $scope.selectedField = null;
                }
                $scope.configError = false;
            }
        });

        $scope.error = function(data, status, headers, config) {
            alert("Application Error Occured. Please Contact Administrator");
        }


        $scope.save = function() {

            $scope.validateVersion();
            if ($scope.configError) {
                return;
            }
            if ($scope.seenReviewed) {

                Service.httpCall("PUT", Constants.url.UpdateConfiguration, $scope.saveSuccessCallBack,
                    $scope.error, {"Version" : $scope.selectedVersion});
            } else {
                Service.httpCall("POST", Constants.url.AddConfiguration, $scope.saveSuccessCallBack,
                    $scope.error, {"Version" : $scope.selectedVersion});
            }

        }

        $scope.saveSuccessCallBack = function(data) {

            $scope.saved = true;
            $location.search({});
            $scope.routingTo('/main/home');
        }

        $scope.updateWorkflow = function(state) {

            var workFlowModel = { Comment : $scope.comment,
                                  FromUserName : $scope.username,
                                  IsUnread : true,
                                  State: state,
                                  CreatedDate : new Date(),
                                  VersionId : $location.search().id};
            Service.httpCall("POST", Constants.url.AddWorkflowAction + "/3", function() {
                    $location.search({});
                    $scope.routingTo('/main/home');
                },
                $scope.error, workFlowModel);
        }

        $scope.validateVersion = function() {

            var version = $scope.selectedVersion;

            if (!version.getWizards() || version.getWizards().length <= 0) {

                $scope.configError = true;
                $scope.configErrorMsg = "Wizard is empty for the version " + version.getVersion();
                return;
            }
            version.getWizards().forEach(function(wizard) {

                if (!wizard.getPages() || wizard.getPages().length <= 0) {

                    $scope.configError = true;
                    var appwizard = $scope.getAppConfigurationsById($scope.appWizards, wizard.getAppWizardId());
                    $scope.configErrorMsg = "Page is empty for the wizard " + appwizard.getDescription();
                    return;
                }
                wizard.getPages().forEach(function(page) {

                    if (!page.getSubPages() || page.getSubPages().length <= 0) {

                        $scope.configError = true;
                        var appPage = $scope.getAppConfigurationsById($scope.appPages, page.getAppPageId());
                        $scope.configErrorMsg = "SubPage is empty for the page " + appPage.getDescription();
                        return;
                    }
                    page.getSubPages().forEach(function(subPage) {

                        if (!subPage.getPanes() || subPage.getPanes().length <= 0) {

                            $scope.configError = true;
                            $scope.configErrorMsg = "Pane is empty for the sub page " + subPage.getDescription();
                            return;
                        }
                        subPage.getPanes().forEach(function(pane) {
                            $scope.validatePane(pane);
                        })
                    });
                });
            });
        }

        $scope.validatePane = function(pane) {
            if ((!pane.getPanes() || pane.getPanes().length <= 0)
                && (!pane.getFields() || pane.getFields().length <= 0)) {

//                $scope.configError = true;
//                $scope.configErrorMsg = "Panes and Fields are empty for the pane " + pane.getDescription();
                return;
            }
            if (pane.getPanes()) {
                pane.getPanes().forEach(function(pane) {
                    $scope.validatePane(pane);
                });
            }
            return;
        }
    }
]);