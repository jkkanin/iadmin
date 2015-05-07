'use strict';

angular.module('config').factory('config.User',[

    function  (){

        var User = function (data) {
            angular.extend(this, {

                Id: null,
                Name: "",
                Username: "",
                Password: null,
                Email: "",
                LoginType: "App",
                Active: null,

                getUserId : function() {
                    return this.UserId;
                },

                getId : function() {
                    return this.Id;
                },

                getName : function () {
                    return this.Name;
                },

                getUsername : function () {
                    return this.Username;
                },

                getEmail : function () {
                    return this.Email;
                },

                getLoginType : function () {
                    return this.LoginType;
                },

                getActive : function () {
                    return this.Active;
                },
                getPassword : function () {
                    return this.Password;
                }
            });

            angular.extend(this, data);
        };

        return  User;
}]);