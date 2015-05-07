'use strict';

angular.module('config').factory('config.ErrorLocale',['config.ErrorLocaleDetail',

    function (ErrorLocaleDetail) {

        var ErrorLocale = function (data) {

            angular.extend(this, {

                Id : null,
                CarrierId : null,
                AppErrorId : null,
                Code : "",
                Description : "",
                ErrorLocaleDetails : null,

                getAppErrorId : function() {
                    return this.AppErrorId;
                },

                getCode : function() {
                    return this.Code;
                },

                setAppErrorId : function(appErrorId) {
                    this.AppErrorId = appErrorId;
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

                setErrorLocaleDetails : function(localeDetails) {
                    this.ErrorLocaleDetails = arrayOfObjectToArrayOfPrototype(localeDetails,
                        function toLocaleDetail(localeDetailsData) {
                            return new ErrorLocaleDetail(localeDetailsData);
                        });
                },

                getErrorLocaleDetails :  function()   {
                    return this.ErrorLocaleDetails;
                }
            });

            angular.extend(this, data);
        };

        return ErrorLocale;
    }]);

