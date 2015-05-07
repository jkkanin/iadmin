'use strict';

angular.module('config').controller('config.CarrierLanguageCtrl', ['$scope', 'config.Service', 'config.Constants', 'config.ConfiguredCarriers', 'config.ConfiguredLanguages',
    'config.Language',
    function ($scope, Service, Constants, ConfiguredCarriers, ConfiguredLanguages, Language) {

        $scope.carriers = ConfiguredCarriers.getCarriers();
        $scope.languages = ConfiguredLanguages.getLanguages();

        $scope.carrier = $scope.carriers[0];

        $scope.getCarrierLanguages = function() {
            Service.httpCall("GET", Constants.url.GetAllLanguagesByCarrierId + "/" + $scope.carrier.getId(), $scope.loadCarrierLanguages,  $scope.error);
        }

        $scope.loadCarrierLanguages = function(data, status, headers, config) {

            $scope.selectedLanguages = arrayOfObjectToArrayOfPrototype(data,
                function toLanguage(languageData) {
                    return new Language(languageData);
                });;

            $scope.availableLanguages = new Array();

            $scope.languages.forEach(function(language) {

                var exist = false;
                $scope.selectedLanguages.forEach(function(carrierLanguage) {
                   if (language.getId() == carrierLanguage.getId()) {
                       exist = true;
                   }
                });
                if (!exist) {
                    $scope.availableLanguages.push(language);
                }
            });

        }

        $scope.error = function(data, status, headers, config) {
            alert("Application Error Occured. Please Contact Administrator");
        }

        $scope.getCarrierLanguages();

        $scope.moveItem = function(item, from, to, isAdd) {

            var idx = from.indexOf(item);
            if (idx != -1) {

                from.splice(idx, 1);
                to.push(item);

                if (isAdd) {
                    Service.httpCall("POST", Constants.url.AddCarrierLanguage, function() {},  $scope.error,
                        {   "CarrierId" : $scope.carrier.getId(),
                            "LanguageId" : item.getId()}
                    );
                } else {
                    Service.httpCall("DELETE", Constants.url.DeleteCarrierLanguage, function() {},  $scope.error,
                        { "CarrierId" : $scope.carrier.getId(),
                          "LanguageId" : item.getId()}
                    );
                }
            }
        };

        $scope.$watch('carrier', function(newValue, oldValue) {
            if ( newValue != oldValue) {
                $scope.getCarrierLanguages();
            }
        });
    }
]);