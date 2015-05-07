'use strict';

angular.module('config').factory('config.Wizard',['config.Page',

    function  (Page){

        var Wizard = function (data) {

            angular.extend(this, {

                Id : null,
                AppWizardId : null,
                VersionId : null,
                Url : null,
                OrderController : null,
                Pages : null,

                getAppWizardId : function () {
                    return this.AppWizardId;
                },

                getOrderController : function () {
                    return this.OrderController;
                },

                getId : function () {
                    return this.Id;
                },

                getUrl : function() {
                    return this.Url;
                } ,

                getVersionId : function() {
                    return this.VersionId;
                },
                setPages : function(pages) {
                    this.Pages = arrayOfObjectToArrayOfPrototype(pages,
                        function toVersion(pageData) {
                            return new Page(pageData);
                        });
                },
                getPages : function() {
                    return this.Pages;
                }
            });

            angular.extend(this, data);
            this.setPages(data.Pages);
        };
        return Wizard;
}]);

