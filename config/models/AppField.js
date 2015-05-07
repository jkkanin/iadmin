'use strict';

angular.module('config').factory('config.AppField',[
    function  (){

        var Field = function (data) {

            angular.extend(this, {

                AppPageId : null,
                Name : null,
                Id : null,
                Description : null,

                getAppPageId : function () {
                    return this.AppPageId;
                },

                getName : function () {
                    return this.Name;
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
        return Field;
    }]);
