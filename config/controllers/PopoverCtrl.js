'use strict';

angular.module('config').controller('config.PopoverCtrl', ['$scope', 'config.Service', 'config.Constants',
    function ($scope, Service, Constants) {

        $scope.firsttime = false;
        $scope.destroyPopover = function(id) {

            $scope.$parent.popovershown = false;
            if ($scope.isAdd) {
                id = 'Add' + id;
            } else {
                if (id == 'Pane') {
                    id = id + $scope.clonedPane.getId();
                }
                if (id == 'Field') {
                    id = id + $scope.clonedField.getId();
                }
            }
            $("#" + id).popover('destroy');
        }

        $scope.saveVersion = function() {

            if (!$scope.versionform.$valid) {
                $scope.firsttime = true;
                return;
            }
            $scope.setSelectedValue($scope.selectedVersion.Id, 'Version', 'versions', 'selectedVersion');
            $scope.destroyPopover('Version');
        }

        $scope.cancelVersion = function() {

            angular.extend($scope.$parent.selectedVersion, $scope.clonedVersion);
            $scope.$parent.selectedVersion.Wizards = $scope.$parent.wizards;
            $scope.destroyPopover('Version');
        }

        $scope.saveWizard = function() {

            if (!$scope.wizardform.$valid) {
                $scope.firsttime = true;
                return;
            }
            if ($scope.isAdd) {

                $scope.$parent.editableWizard.AppWizardId = $scope.selectedAppWizard.getId();
                $scope.$parent.wizards.push($scope.$parent.editableWizard);
            } else {

                $scope.$parent.selectedWizard.AppWizardId = $scope.selectedAppWizard.getId();
                $scope.setSelectedValue($scope.$parent.selectedWizard.Id, 'Wizard', 'wizards', 'selectedWizard');
            }

            $scope.destroyPopover('Wizard');
        }

        $scope.cancelWizard = function() {

            if (!$scope.isAdd) {
                angular.extend($scope.$parent.selectedWizard, $scope.clonedWizard);
                $scope.$parent.selectedWizard.Pages = $scope.$parent.pages;
            }
            $scope.destroyPopover('Wizard');
        }

        $scope.deleteWizard = function() {

            $scope.delete($scope.$parent.wizards, $scope.$parent.selectedWizard, 'selectedWizard');
            $scope.destroyPopover('Wizard');
            if ($scope.$parent.selectedWizard) {
                $scope.setSelectedValue($scope.$parent.selectedWizard.Id, 'Wizard', 'wizards', 'selectedWizard');
            } else {
                $scope.setDefaultValue('Wizard');
            }
        }

        $scope.delete = function(collection, model, changedModel) {

            var idx = collection.indexOf(model);
            if (idx != -1) {
                collection.splice(idx, 1);
            }
            $scope.$parent[changedModel] = collection[0];
        }

        $scope.savePage = function() {

            if (!$scope.pageform.$valid) {
                $scope.firsttime = true;
                return;
            }
            if ($scope.isAdd) {

                $scope.$parent.editablePage.AppPageId = $scope.selectedAppPage.getId();
                $scope.$parent.pages.push($scope.$parent.editablePage);
            } else {

                $scope.$parent.selectedPage.AppPageId = $scope.selectedAppPage.getId();
                $scope.setSelectedValue($scope.$parent.selectedPage.Id, 'Page', 'pages', 'selectedPage');
            }

            $scope.destroyPopover('Page');
        }

        $scope.cancelPage = function() {

            if (!$scope.isAdd) {

                angular.extend($scope.$parent.selectedPage, $scope.clonedPage);
                $scope.$parent.selectedPage.SubPages = $scope.$parent.subPages;
            }
            $scope.destroyPopover('Page');
        }

        $scope.deletePage = function() {

            $scope.delete($scope.$parent.pages, $scope.$parent.selectedPage, 'selectedPage');
            $scope.destroyPopover('Page');
            if ($scope.$parent.selectedPage) {
                $scope.setSelectedValue($scope.$parent.selectedPage.Id, 'Page', 'pages', 'selectedPage');
            } else {
                $scope.setDefaultValue('Page');
            }
        }

        $scope.SubPagetypeOptions = [
            'P','F','M', 'O'
        ];

        $scope.saveSubPage = function() {

            if (!$scope.subpageform.$valid) {
                $scope.firsttime = true;
                return;
            }
            if ($scope.isAdd) {
                $scope.$parent.subPages.push($scope.$parent.editableSubPage);
            } else {
                $scope.setSelectedValue($scope.$parent.selectedSubPage.Id, 'SubPage', 'subPages', 'selectedSubPage');
            }

            $scope.destroyPopover('SubPage');
        }

        $scope.cancelSubPage = function() {

            if (!$scope.isAdd) {
                angular.extend($scope.$parent.selectedSubPage, $scope.clonedSubPage);
                $scope.$parent.selectedPage.SubPages = $scope.$parent.subPages;
            }

            $scope.destroyPopover('SubPage');
        }

        $scope.deleteSubPage = function() {

            $scope.delete($scope.$parent.subPages, $scope.$parent.selectedSubPage, 'selectedSubPage');
            $scope.destroyPopover('SubPage');
            if ($scope.$parent.selectedSubPage) {
                $scope.setSelectedValue($scope.$parent.selectedSubPage.Id, 'SubPage', 'subPages', 'selectedSubPage');
            } else {
                $scope.setDefaultValue('SubPage');
            }
        }

        $scope.savePane = function() {

            if (!$scope.paneform.$valid) {
                $scope.firsttime = true;
                return;
            }

            if ($scope.isAdd) {
                $scope.$parent.editablePane.setPanes([]);
                $scope.$parent.panes.push($scope.$parent.editablePane);
            }

            $scope.destroyPopover('Pane');
        }

        $scope.cancelPane = function() {

            if (!$scope.isAdd) {
                angular.extend($scope.$parent.editablePane, $scope.clonedPane);
                $scope.$parent.editablePane.Fields = $scope.editablePaneFields;
            }

            $scope.destroyPopover('Pane');
        }

        $scope.deletePane = function() {

            $scope.destroyPopover('Pane' + $scope.$parent.editablePane.getId());
            $scope.delete($scope.$parent.panes, $scope.$parent.editablePane, 'editablePane');
        }

        $scope.saveField = function() {

            if (!$scope.fieldform.$valid) {
                $scope.firsttime = true;
                return;
            }

            if ($scope.isAdd) {

                $scope.$parent.editableField.AppFieldId = $scope.selectedAppField.getId();
                $scope.$parent.fields.push($scope.$parent.editableField);
            } else {
                $scope.$parent.selectedField.AppFieldId = $scope.selectedAppField.getId();
            }
            $scope.$parent.selectedAppField = $scope.selectedAppField;
            $scope.destroyPopover('Field');
        }

        $scope.cancelField = function() {

            if (!$scope.isAdd) {
                angular.extend($scope.$parent.selectedField, $scope.clonedField);
            }

            $scope.destroyPopover('Field');
        }

        $scope.deleteField = function() {

            $scope.destroyPopover('Field');
            $scope.delete($scope.$parent.fields, $scope.$parent.selectedField, 'selectedField');
        }
    }
]);