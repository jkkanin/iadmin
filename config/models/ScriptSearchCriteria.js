'use strict';

angular.module('config').factory('config.ScriptSearchCriteria', [
    function  (){

        var ScriptSearchCriteria = function (data) {

            angular.extend(this, {

                ErrorType : null,
                CarrierId : null,
                LanguageId : null,
                Value : null,
                IsUnRead : null,
                Status : null,
                
                getErrorType : function () {
                    return this.ErrorType;
                },

                getCarrierId : function () {
                    return this.CarrierId;
                },

                getLanguageId : function () {
                    return this.LanguageId;
                },
                
                getValue : function () {
                    return this.Value;
                },

                getIsUnRead : function () {
                    return this.IsUnRead;
                },

                getStatus : function () {
                    return this.Status;
                },
            });

            angular.extend(this, data);
        };

        return ScriptSearchCriteria;
}]);
