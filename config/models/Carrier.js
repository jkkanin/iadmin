'use strict';

angular.module('config').factory('config.Carrier',[

    function  (){

        var Carrier = function (data) {
            angular.extend(this, {

                Id : null,
                Code : null,
                Description : "",
                Header : null,
                Body : null,
                Footer : null,
                ConnectorVersion : null,
                VersionId : null,

                getVersionId : function() {
                    return this.VersionId;
                },

                getId : function() {
                    return this.Id;
                },

                getCode : function () {
                    return this.Code;
                },

                getDescription : function () {
                    return this.Description;
                },

                getHeader : function () {
                    return this.Header;
                },

                getBody : function () {
                    return this.Body;
                },

                getFooter : function () {
                    return this.Footer;
                },
                getConnectorVersion : function () {
                    return this.ConnectorVersion;
                }
            });

            angular.extend(this, data);
        };

        return  Carrier;
}]);