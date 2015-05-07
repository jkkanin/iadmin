'use strict';

angular.module('config').factory('config.Field',[
    function  (){

        var Field = function (data) {

            angular.extend(this, {

                AppFieldId : null,
                Order : null,
                Id : null,
                PaneId : null,
                IsDeleted : null,

                getAppFieldId : function () {
                    return this.AppFieldId;
                },

                getOrder : function () {
                    return this.Order;
                },
                getId : function () {
                    return this.Id;
                },

                getPaneId : function () {
                    return this.PaneId;
                },

                getIsDeleted : function () {
                    return this.IsDeleted;
                }
            });
            angular.extend(this, data);
        };
        return Field;
}]);
