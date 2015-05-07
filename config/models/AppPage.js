'use strict';

angular.module('config').factory('config.AppPage',[

    function  (){

        var Page = function (data) {

            angular.extend(this, {

                Id : null,
                AppWizardId : null,
                Name : null,
                Description : null,

                getId : function () {
                    return this.Id;
                },
                getAppWizardId : function () {
                    return this.AppWizardId;
                },

                getName : function () {
                    return this.Name;
                },

                getDescription : function () {
                    return this.Description;
                }
            });
            angular.extend(this, data);
        };
        return Page;
    }]);
