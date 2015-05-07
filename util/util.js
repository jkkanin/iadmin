'use strict';

angular.module('util', []);

angular.module('util').service('util.Constants',[
    function  (){
        var baseServiceURL = "/iweb-adminconsole/api/"
        var loginServiceURL = baseServiceURL + "user/GetUserRoles";
        var windowsLoginServiceURL = baseServiceURL + "user/GetWindowsLoginRoles";
        var Constants = {
            getLoginServiceURL : function () {
                return loginServiceURL;
            },
            getWindowsLoginServiceURL : function () {
                return windowsLoginServiceURL;
            }
        }
        return Constants;
    }
]);

function arrayOfObjectToArrayOfPrototype (fromObject, converter) {

    if (typeof converter != "function") {
        return fromObject;
    }
    if (fromObject instanceof Array) {
        var toArray = new Array(fromObject.length);
        for (var i = 0; i < fromObject.length; i++) {
            toArray[i] = converter(fromObject[i]);
        }
        return toArray;
    } else {
        return fromObject;
    }
}
