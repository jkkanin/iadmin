'use strict';

angular.module('config').factory('config.LocaleMapping',['config.LocaleDetail', 'config.Language',
    function  (LocaleDetail, Language){

        var LocaleMapping = function (data) {

            angular.extend(this, {

                LocaleDetail : null,
                Language : null,

                setLocaleDetail : function (LocaleDetail) {
                    this.LocaleDetail = LocaleDetail;
                },

                setLanguage : function (language) {
                    this.Language = language;
                },

                getLanguage : function () {
                    return this.Language;
                },

                getLocaleDetail : function () {
                    return this.LocaleDetail;
                }
            });

            angular.extend(this, data);
        };
        return LocaleMapping;
    }]);
