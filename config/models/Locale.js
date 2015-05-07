'use strict';

angular.module('config').factory('config.Locale',['config.LocaleDetail',

    function (LocaleDetail) {

        var Locale = function (data) {

            angular.extend(this, {

                Id : null,
                CarrierId : null,
                AppLocaleId : null,
                Description : "",
                LocaleDetails : null,

                getAppLocaleId : function() {
                    return this.AppLocaleId;
                },

                setAppLocaleId : function(appLocaleId) {
                    this.AppLocaleId = appLocaleId;
                },

                getId : function () {
                    return this.Id;
                },

                getCarrierId : function() {
                    return this.CarrierId;
                },

                setCarrierId : function(carrierId) {
                    this.CarrierId = carrierId;
                },

                getDescription : function() {
                    return this.Description;
                },

                setDescription : function(description) {
                    this.Description = description;
                },

                setLocaleDetails : function(localeDetails) {
                    this.LocaleDetails = arrayOfObjectToArrayOfPrototype(localeDetails,
                        function toLocaleDetail(localeDetailsData) {
                            return new LocaleDetail(localeDetailsData);
                        });
                },

                getLocaleDetails :  function()   {
                    return this.LocaleDetails;
                }
            });

            angular.extend(this, data);
        };

        return Locale;
    }]);

