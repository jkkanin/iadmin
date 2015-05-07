'use strict';

angular.module('config').factory('config.AppError', [
    function  (){

        var AppError = function (data) {

            angular.extend(this, {

                Code : null,
                Id : null,
                Description : null,

                getCode : function () {
                    return this.Code;
                },

                getId : function () {
                    return this.Id;
                },

                getDescription : function () {
                    return this.Description;
                }
            });

            angular.extend(this, data);
        };

        return AppError;
}]);
