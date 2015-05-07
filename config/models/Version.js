'use strict';

angular.module('config').factory('config.Version',['config.Wizard',

    function (Wizard){

        var VersionConfig = function (data) {

            angular.extend(this, {

                Id : null,
                Version : null,
                Description : null,
                State : null,
                IsDeleted : null,
                Wizards : null,
                BaseVersionId : null,

                getId : function () {
                    return this.Id;
                },

                getVersion : function () {
                    return this.Version;
                },

                getDescription : function () {
                    return this.Description;
                },

                getState : function () {
                    return this.State;
                },

                getIsDeleted : function () {
                    return this.IsDeleted;
                },

                setWizards : function(wizards) {
                   this.Wizards = arrayOfObjectToArrayOfPrototype(wizards,
                        function toVersion(wizardData) {
                            return new Wizard(wizardData);
                    });
                },
                getWizards : function() {
                    return this.Wizards;
                },
                getBaseVersion : function() {
                    return this.BaseVersionId;
                }
            });

            angular.extend(this, data);
        };

        return VersionConfig;
    }]);
