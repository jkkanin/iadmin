'use strict';

angular.module('config').factory('config.Pane',['config.Field',

    function  (Field){

        var Pane = function (data) {

            angular.extend(this, {

                Name : null,
                Order : null,
                IsDeleted : null,
                Id : null,
                SubPageId : null,
                Description : null,
                Fields : null,
                Panes : null,
                MasterPaneId : null,
                Style : null,

                getName : function () {
                    return this.Name;
                },

                getOrder : function () {
                    return this.Order;
                },

                getIsDeleted : function () {
                    return this.IsDeleted;
                },
                getId : function () {
                    return this.Id;
                },

                getSubPageId : function () {
                    return this.SubPageId;
                },

                getDescription : function () {
                    return this.Description;
                },
                setFields : function(fields) {
                    this.Fields = arrayOfObjectToArrayOfPrototype(fields,
                        function toField(fieldData) {
                            return new Field(fieldData);
                        });
                },
                getFields : function() {
                    return this.Fields;
                },

                getPanes : function() {
                    return this.Panes;
                },
                getMasterPaneId : function () {
                    return this.MasterPaneId;
                },

                getStyle : function () {
                    return this.Style;
                }
            });
            angular.extend(this, data);
            this.setPanes = function(panes) {
                this.Panes = arrayOfObjectToArrayOfPrototype(panes,
                    function toPane(panedata) {
                        return new Pane(panedata);
                    });
            };
            this.setFields(data.Fields);
            this.setPanes(data.Panes);
        };
        return Pane;
}]);
