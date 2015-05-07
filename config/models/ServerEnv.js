'use strict';

angular.module('config').factory('config.ServerEnv', [
	function() {

        var ServerEnv = function (data) {

            angular.extend(this, {

                Id : null,
                ServerEnvName : null,
                CarrierCode : null,
                
                getId : function () {
                    return this.Id;
                },

                getServerEnvName : function () {
                    return this.ServerEnvName;
                },
                
                getCarrierCode : function () {
                    return this.CarrierCode;
                }
            });

            angular.extend(this, data);
        };

        return ServerEnv;
}]);
