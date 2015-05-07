'use strict';

angular.module('config').factory('config.CarrierLanguage',[
    function  (){

        var CarrierLanguage = function (data) {

            angular.extend(this, {

                CarrierId : null,
                LanguageId : null,

                getCarrierId : function () {
                    return this.CarrierId;
                },

                getLanguageId : function () {
                    return this.LanguageId;
                }
            });
            angular.extend(this, data);
        };

        return CarrierLanguage;
    }]);
