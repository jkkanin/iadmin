'use strict';

angular.module('config').factory('config.Role',[
    function  (){

        var Role = function (data) {

            angular.extend(this, {

                Id: null,
                Name : null,

                getName : function () {
                    return this.getName;
                },
                getId : function () {
                    return this.Id;
                }
            });
            angular.extend(this, data);
        };

        return Role;
    }]);
