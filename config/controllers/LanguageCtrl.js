'use strict';

angular.module('config').controller('config.LanguageCtrl', ['$scope', 'config.Service', 'config.Constants', 'config.ConfiguredLanguages', 'config.Language',
    function ($scope, Service, Constants, ConfiguredLanguages, Language) {

        $scope.firsttime = false;
        $scope.saved = false;
        $scope.languages = ConfiguredLanguages.getLanguages();
        $scope.selectedLanguage = $scope.languages[0];

        $scope.editableLanguage = angular.copy($scope.selectedLanguage);

        $scope.$watch('selectedLanguage', function(newValue, oldValue) {
            if (newValue == oldValue) {
                return;
            }
            $scope.editableLanguage = angular.copy($scope.selectedLanguage);
            $scope.firsttime = false;
        });

        $scope.addLanguage = function() {

            $scope.isAdd = true;

            var newLanguage =  new Language();
            $scope.languages.push(newLanguage);
            $scope.selectedLanguage = newLanguage;
        }

        $scope.saveLanguage = function() {

            $scope.firsttime = true;
            if (!$scope.languageform.$valid) {
                return;
            }

            if ($scope.editableLanguage.getId()) {
                Service.httpCall('PUT', Constants.url.UpdateLanguage, $scope.setSavedLanguage, $scope.error, $scope.editableLanguage);
            } else {
                Service.httpCall('POST', Constants.url.AddLanguage, $scope.setSavedLanguage, $scope.error, $scope.editableLanguage);
            }
        }

        $scope.setSavedLanguage = function(data) {

            angular.extend($scope.selectedLanguage, $scope.editableLanguage)
            if ($scope.isAdd) {

                $scope.languages = ConfiguredLanguages.getLanguages();
                $scope.selectedLanguage = $scope.languages[0];
            }
            $scope.isAdd = false;
            $scope.firsttime = false;
            $scope.saved = true;
        }

        $scope.error = function(data, status, headers, config) {
            alert("Application Error Occured. Please Contact Administrator");
        }

        $scope.cancel = function() {

            if ($scope.isAdd) {

                $scope.languages.pop();
                $scope.selectedLanguage = $scope.languages[0];
                $scope.isAdd = false;
            }
            $scope.editableLanguage = angular.copy($scope.selectedLanguage);
            $scope.firsttime = false;
            $scope.saved = false;
        }
    }
]);