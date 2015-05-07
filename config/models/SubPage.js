'use strict';

angular.module('config').factory('config.SubPage',['config.Pane',

    function  (Pane){

    var SubPage = function (data) {

        angular.extend(this, {

            Id : null,
            PageId : null,
            Name : null,
            Description : null,
            Type : null,
            Order : null,
            IsDeleted : null,
            Panes : null,
            IsChatEnabled : false,
            LogPageName : null,

            getId : function () {
                return this.Id;
            },
            getPageId : function () {
                return this.PageId;
            },

            getName : function () {
                return this.Name;
            },
            getDescription : function () {
                return this.Description;
            },

            getType : function () {
                return this.Type;
            },

            getIsDeleted : function () {
                return this.IsDeleted;
            },

            getOrder : function () {
                return this.Order;
            },
            setPanes : function(panes) {
                this.Panes = arrayOfObjectToArrayOfPrototype(panes,
                    function toPane(paneData) {
                        return new Pane(paneData);
                    });
            },
            getPanes : function() {
                return this.Panes;
            },
            getIsChatEnabled : function() {
                return this.IsChatEnabled;
            },
            getLogPageName : function() {
                return this.LogPageName;
            }
        });
        angular.extend(this, data);
        this.setPanes(data.Panes);
    };
    return SubPage;
}]);
