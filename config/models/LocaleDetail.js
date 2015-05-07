'use strict';

angular.module('config').factory('config.LocaleDetail',[
    function  (){

        var LocaleDetail = function (data) {

            angular.extend(this, {

                Id : null,
                LocaleId : null,
                LanguageId : null,
                Value : null,

                getLocaleId : function () {
                    return this.LocaleId;
                },

                getLanguageId : function () {
                    return this.LanguageId;
                },

                getValue : function () {
                    return this.Value;
                },

                getId : function() {
                    return this.Id;
                },

                setLocaleId : function(localeId) {
                     this.LocaleId = localeId;
                },
                setLanguageId : function(languageId) {
                    this.LanguageId = languageId;
                }
            });
            angular.extend(this, data);
        };
        return LocaleDetail;
    }]);
