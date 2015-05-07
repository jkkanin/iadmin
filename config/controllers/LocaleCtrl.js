'use strict';

angular.module('config').controller('config.LocaleCtrl', ['$scope', 'config.Service', 'config.Constants',
    'config.ConfiguredCarriers', 'config.ConfiguredLocales', 'config.Locale', 'config.Language','$http', 'config.LocaleDetail', 'config.LocaleMapping',
    function ($scope, Service, Constants, ConfiguredCarriers, ConfiguredLocales, Locale, Language, $http, LocaleDetail, LocaleMapping) {

        $scope.invalidMap = false;
        $scope.saved = false;
        $scope.firsttime = false;

        $scope.carriers = ConfiguredCarriers.getCarriers();
        $scope.allAppLocales =  ConfiguredLocales.getAppLocales();

        $scope.getAppLocaleById = function(id) {

            var returnAppLocale;
            $scope.allAppLocales.forEach(function(appLocale) {
                if (appLocale.getId() == id) {
                    returnAppLocale = appLocale;
                }
            });
            return returnAppLocale;
        }

        $scope.$watch('selectedCarrier', function(newValue, oldValue) {

            if (newValue) {
                $scope.fetchLocalesAndLanguage();
            }
        });

        $scope.fetchLocalesAndLanguage = function() {

            Service.httpCall("GET", Constants.url.GetAllLanguagesByCarrierId + "/" + $scope.selectedCarrier.getId(),
                $scope.loadLocalesAndLanguage,  $scope.error);
        }

        $scope.loadLocalesAndLanguage = function(data) {

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

            $scope.fetchLocales();
        }

        $scope.fetchLocales = function() {
            Service.httpCall('GET', Constants.url.GetAllCarrierLocales + "?carrierid=" + $scope.selectedCarrier.getId(),
                $scope.loadLocales, $scope.error);
        }

        $scope.loadLocales = function(data) {

            $scope.locales = arrayOfObjectToArrayOfPrototype(data,
                function toLocale(localeData) {
                    return new Locale(localeData);
                });
            if ($scope.locales.length == 0) {
                $scope.createLocale(new Locale());
            }
            $scope.loadAppLocales();
            $scope.selectedLocale = $scope.locales[0];
        }

        $scope.createLocale = function(newLocale) {
            newLocale.setCarrierId($scope.selectedCarrier.getId());
            $scope.locales.push(newLocale);
        }

        $scope.$watch('selectedLocale', function(newValue, oldValue) {

            if (!newValue && newValue == oldValue) {
                return;
            }

            if (!$scope.addedScript) {
                $scope.saved = false;
            }
            $scope.addedScript = false;
            $scope.selectedAppLocale = $scope.getAppLocaleById($scope.selectedLocale.getAppLocaleId());
            $scope.fetchLocaleDetails();
            $scope.invalidMap = false;
        });

        $scope.fetchLocaleDetails = function() {
            if (!$scope.selectedLocale.getId()) {
                $scope.loadLocaleDetails([]);
                return;
            }
            Service.httpCall('GET', Constants.url.GetLocaleDetailsbyLocaleId + "/" + $scope.selectedLocale.getId(),
                $scope.loadLocaleDetails, $scope.error);
        }

        $scope.loadLocaleDetails = function(data) {

            $scope.selectedLocale.setLocaleDetails(data);
            $scope.editableLocale = angular.copy($scope.selectedLocale);

            $scope.localeMappings.forEach(function(localeMapping) {

                var exist = false;
                $scope.editableLocale.getLocaleDetails().forEach(function(localeDetail) {
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

            var localeDetail = new LocaleDetail();
            localeDetail.setLocaleId($scope.editableLocale.getId());
            localeDetail.setLanguageId(languageId);
            $scope.editableLocale.getLocaleDetails().push(localeDetail);

            return localeDetail;
        }

        $scope.selectedCarrier = $scope.carriers[0];

        $scope.loadAppLocales = function() {

            $scope.appLocales = [];
            $scope.allAppLocales.forEach(function(appLocale) {

                var exist = false;

                $scope.locales.forEach(function(locale) {
                    if (appLocale.getId() == locale.getAppLocaleId()) {
                        exist = true;
                    }
                });
                if (!exist) {
                    $scope.appLocales.push(appLocale);
                }
            });
        }

        $scope.firsttime = false;

        $scope.addLocale = function() {

            $scope.isAdd = true;

            var newLocale =  new Locale();
            $scope.createLocale(newLocale);
            $scope.selectedLocale = newLocale;
        }

        $scope.saveLocale = function() {

            $scope.firsttime = true;
            $scope.editableLocale.setAppLocaleId($scope.selectedAppLocale.getId());
            if (!$scope.localeform.$valid || !$scope.validateLocale()) {
                return;
            }

            Service.httpCall('POST', Constants.url.AddLocaleandDetail, $scope.setSavedLocale, $scope.error, $scope.editableLocale);
        }

        $scope.setSavedLocale = function(data) {

            angular.extend($scope.selectedLocale, angular.copy($scope.editableLocale));
            if ($scope.isAdd) {
                $scope.fetchLocales();
                $scope.addedScript = true;
            } else {
                $scope.addedScript = false;
            }
            $scope.isAdd = false;
            $scope.firsttime = false;
            $scope.saved = true;
            $scope.invalidMap = false;
        }

        $scope.validateLocale = function() {

            var exist = false;
            $scope.locales.forEach(function(locale) {

                if (locale.getId() != $scope.editableLocale.getId()
                    && locale.getAppLocaleId() == $scope.editableLocale.getAppLocaleId()) {
                    exist = true;
                }
            });

            if (exist) {
                $scope.invalidMap = true;
                return false;
            }

            return true;
        }

        $scope.cancel = function() {

            if ($scope.isAdd) {

                $scope.locales.pop();
                $scope.selectedLocale = $scope.locales[0];
                $scope.isAdd = false;
            }
            $scope.editableLocale = angular.copy($scope.selectedLocale);
            $scope.selectedAppLocale = $scope.getAppLocaleById($scope.selectedLocale.getAppLocaleId());
            $scope.loadLocaleDetails($scope.selectedLocale.getLocaleDetails());
            $scope.firsttime = false;
            $scope.saved = false;
        }

        $scope.$watch('selectedAppLocale', function(newValue, oldValue) {
            $scope.invalidMap = false;
        });
    }
]);