'use strict';

angular.module('config').factory('config.ErrorLocaleDetail',[
    function  (){

        var ErrorLocaleDetail = function (data) {

            angular.extend(this, {

                Id : null,
                LanguageId : null,
                Language : null,
                Value : null,
                ErrorLocaleId : null,

                getLanguageId : function () {
                    return this.LanguageId;
                },

                getLanguage : function () {
                    return this.Language;
                },

                getValue : function () {
                    return this.Value;
                },

                getId : function() {
                    return this.Id;
                },

                getErrorLocaleId : function() {
                    return this.ErrorLocaleId;
                },

                setErrorLocaleId : function(localeId) {
                    this.ErrorLocaleId = localeId;
                },
                setLanguageId : function(languageId) {
                    this.LanguageId = languageId;
                }
            });
            angular.extend(this, data);
        };
        return ErrorLocaleDetail;
    }]);
