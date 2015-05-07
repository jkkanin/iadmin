'use strict';

angular.module('config').factory('config.UserRole',[
    function  (){

        var UserRole = function (data) {

            angular.extend(this, {

                UserId : null,
                RoleId : null,

                getCarrierId : function () {
                    return this.UserId;
                },

                getLanguageId : function () {
                    return this.RoleId;
                }
            });
            angular.extend(this, data);
        };

        return UserRole;
    }]);
