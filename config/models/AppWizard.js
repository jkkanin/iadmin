'use strict';

angular.module('config').factory('config.AppWizard',[

    function  (){

        var Wizard = function (data) {

            angular.extend(this, {

                Id : null,
                Name : null,
                Description : null,

                getId : function () {
                    return this.Id;
                },

                getName : function() {
                    return this.Name;
                } ,

                getDescription : function() {
                    return this.Description;
                }
            });

            angular.extend(this, data);
        };
        return Wizard;
    }]);

