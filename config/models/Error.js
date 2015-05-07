'use strict';

angular.module('config').factory('config.Error', ['config.Carrier', 'config.ErrorLocaleDetail', 'config.Status',
    function  (Carrier, ErrorLocaleDetail, Status) {

        var Error = function (data) {

            angular.extend(this, {

                Code : null,
                Id : null,
                Description : null,
                ErrorType : null,
                Carriers : new Array(),
                ErrorLocaleDetails : new Array(),
                Status : null,
                Comments : null,
                
                getCode : function () {
                    return this.Code;
                },

                getId : function () {
                    return this.Id;
                },

                getDescription : function () {
                    return this.Description;
                },
                
                getErrorType : function () {
                    return this.Description;
                },

                getCarriers : function () {
                    return this.Carriers;
                },

                getErrorLocaleDetails : function () {
                    return this.ErrorLocaleDetails;
                },
                
                getStatus : function () {
                    return this.Status;
                },
                
                getComments : function () {
                    return this.Comments;
                }
                
            });

            angular.extend(this, data);
        };

        return Error;
}]);
