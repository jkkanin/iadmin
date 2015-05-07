'use strict';

angular.module('config').factory('config.Page',['config.SubPage',

    function  (SubPage){

    var Page = function (data) {

        angular.extend(this, {

            Id : null,
            WizardId : null,
            AppPageId : null,
            Order : null,
            IsDeleted : null,
            SubPages : null,

            getId : function () {
                return this.Id;
            },
            getAppPageId : function () {
                return this.AppPageId;
            },

            getWizardId : function () {
                return this.WizardId;
            },

            getIsDeleted : function () {
                return this.IsDeleted;
            },

            getOrder : function () {
                return this.Order;
            },

            setSubPages : function(subPages) {
                this.SubPages = arrayOfObjectToArrayOfPrototype(subPages,
                    function toSubPage(subPageData) {
                        return new SubPage(subPageData);
                    });
            },
            getSubPages : function() {
                return this.SubPages;
            }
        });
        angular.extend(this, data);
        this.setSubPages(data.SubPages);
    };
    return Page;
}]);
