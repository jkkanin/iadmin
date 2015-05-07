'use strict';

angular.module('config').factory('config.Language',[
    function  (){

        var Language = function (data) {

            angular.extend(this, {

                Id : null,
                Code : null,
                Description : "",

                getCode : function () {
                    return this.getCode;
                },

                getDescription : function () {
                    return this.Description;
                },
                getId : function () {
                    return this.Id;
                }
            });
            angular.extend(this, data);
        };

        return Language;
    }]);
