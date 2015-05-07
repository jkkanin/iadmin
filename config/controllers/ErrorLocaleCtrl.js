'use strict';

angular.module('config').controller('config.ErrorLocaleCtrl', ['$scope', 'config.Service', 'config.Constants',
    'config.ConfiguredCarriers', 'config.ConfiguredErrorLocales', 'config.ErrorLocale', 'config.Language','$http', 'config.ErrorLocaleDetail', 'config.LocaleMapping',
    function ($scope, Service, Constants, ConfiguredCarriers, ConfiguredErrorLocales, ErrorLocale, Language, $http, ErrorLocaleDetail, LocaleMapping) {

        $scope.carriers = ConfiguredCarriers.getCarriers();
        $scope.allAppErrors =  ConfiguredErrorLocales.getAppErrors();

        $scope.getAppErrorsById = function(id) {

            var returnAppError;
            $scope.allAppErrors.forEach(function(appError) {
                if (appError.getId() == id) {
                    returnAppError = appError;
                }
            });
            return returnAppError;
        }

        $scope.$watch('selectedCarrier', function(newValue, oldValue) {

            if (newValue) {
                $scope.fetchErrorsAndLanguage();
            }
        });

        $scope.fetchErrorsAndLanguage = function() {

            Service.httpCall("GET", Constants.url.GetAllLanguagesByCarrierId + "/" + $scope.selectedCarrier.getId(),
                $scope.loadErrorsAndLanguage,  $scope.error);
        }

        $scope.loadErrorsAndLanguage = function(data) {

            $scope.carrierLanguages = arrayOfObjectToArrayOfPrototype(data,
                function toLanguage(languageData) {
                    return new Language(languageData);
                });
            $scope.localeMappings = [];
            $scope.carrierLanguages.forEach(function(carrierLanguage) {

                var localeMapping = new LocaleMapping();
                localeMapping.setLanguage(carrierLanguage);
                $scope.localeMappings.push(localeMapping);
            });

            $scope.fetchErrorLocales();
        }

        $scope.fetchErrorLocales = function() {
            Service.httpCall('GET', Constants.url.GetAllCarrierErrorLocalesById + "?carrierid=" + $scope.selectedCarrier.getId(),
                $scope.loadErrorLocales, $scope.error);
        }

        $scope.loadErrorLocales = function(data) {

            $scope.errorlocales = arrayOfObjectToArrayOfPrototype(data,
                function toErrorLocale(localeData) {
                    return new ErrorLocale(localeData);
                });

            $scope.selectedErrorLocale = $scope.errorlocales[0];
        }

        $scope.createErrorLocale = function(newLocale) {
            newLocale.setCarrierId($scope.selectedCarrier.getId());
            $scope.selectedAppErrorLocale = null;
            $scope.errorlocales.push(newLocale);
        }

        $scope.$watch('selectedErrorLocale', function(newValue, oldValue) {

            if (!newValue) {
                $scope.editableErrorLocale = undefined;
            }
            if (!newValue || newValue == oldValue) {
                return;
            }

            if ($scope.selectedErrorLocale.getAppErrorId()) {
                $scope.selectedAppErrorLocale = $scope.getAppErrorsById($scope.selectedErrorLocale.getAppErrorId());
            }

            $scope.fetchLocaleDetails();
        });

        $scope.fetchLocaleDetails = function() {

            if (!$scope.selectedErrorLocale) {
                return;
            }
            if (!$scope.selectedErrorLocale.getId()) {
                $scope.loadLocaleDetails([]);
                return;
            }
            Service.httpCall('GET', Constants.url.GetErrorLocaleDetailByLocaleId + "/" + $scope.selectedErrorLocale.getId(),
                $scope.loadLocaleDetails, $scope.error);
        }

        $scope.loadLocaleDetails = function(data) {

            $scope.selectedErrorLocale.setErrorLocaleDetails(data);
            $scope.editableErrorLocale = angular.copy($scope.selectedErrorLocale);

            $scope.localeMappings.forEach(function(localeMapping) {

                var exist = false;
                $scope.editableErrorLocale.getErrorLocaleDetails().forEach(function(localeDetail) {
                    if (localeDetail.getLanguageId() == localeMapping.getLanguage().getId()) {
                        exist = true;
                        localeMapping.setLocaleDetail(localeDetail);
                    }
                });

                if (!exist || !localeMapping.getLocaleDetail()) {
                    localeMapping.setLocaleDetail($scope.createLocaleDetail(localeMapping.getLanguage().getId()));
                }
            });

            $scope.firsttime = false;
        }

        $scope.createLocaleDetail = function(languageId) {

            var localeDetail = new ErrorLocaleDetail();
            localeDetail.setErrorLocaleId($scope.editableErrorLocale.getId());
            localeDetail.setLanguageId(languageId);
            $scope.editableErrorLocale.getErrorLocaleDetails().push(localeDetail);

            return localeDetail;
        }

        $scope.selectedCarrier = $scope.carriers[0];

        $scope.firsttime = false;

        $scope.addErrorLocale = function() {

            $scope.isAdd = true;

            var newLocale =  new ErrorLocale();
            $scope.createErrorLocale(newLocale);
            $scope.selectedErrorLocale = newLocale;
        }

        $scope.saveErrorLocale = function() {

            $scope.firsttime = true;
            if ($scope.isAdd && $scope.selectedAppErrorLocale) {
                $scope.editableErrorLocale.setAppErrorId($scope.selectedAppErrorLocale.getId());
            }


            if (!$scope.errorlocaleform.$valid) {
                return;
            }

            Service.httpCall('POST', Constants.url.AddErrorandDetail, $scope.setSavedErrorLocale,
                $scope.error, $scope.editableErrorLocale);
        }

        $scope.setSavedErrorLocale = function(data) {

            angular.extend($scope.selectedErrorLocale, $scope.editableErrorLocale);
            if ($scope.isAdd) {
                $scope.fetchErrorLocales();
            }
            $scope.isAdd = false;
            $scope.firsttime = false;
            $scope.saved = true;
        }

        $scope.cancel = function() {

            if ($scope.isAdd) {

                $scope.errorlocales.pop();
                $scope.selectedErrorLocale = $scope.errorlocales[0];
                $scope.isAdd = false;
            }
            if ($scope.selectedErrorLocale) {
                $scope.editableErrorLocale = angular.copy($scope.selectedErrorLocale);
                $scope.loadLocaleDetails($scope.selectedErrorLocale.getErrorLocaleDetails());
            } else {
                $scope.editableErrorLocale = undefined;
            }

            $scope.firsttime = false;
            $scope.saved = false;
        }

        $scope.$watch('selectedAppErrorLocale', function(newValue, oldValue) {
            if (newValue && $scope.editableErrorLocale) {
                $scope.editableErrorLocale.Code = newValue.getCode();
                $scope.editableErrorLocale.Description = newValue.getDescription();
                $scope.editableErrorLocale.AppErrorId = newValue.getId();
            }
        });

        $scope.error =  function() {
            alert("Application Error Occured");
        }
    }
]);