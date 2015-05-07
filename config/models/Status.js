'use strict';

angular.module('config').factory('config.Status',[
    function  (){

        var Status = function (data) {

            angular.extend(this, {

                Id : null,
                Status : null,
                Action : null,

                getStatus : function () {
                    return this.Status;
                },

                getAction : function () {
                    return this.Action;
                },
                
                getId : function() {
                    return this.Id;
                }
            });
            angular.extend(this, data);
        };
        return Status;
    }]);
