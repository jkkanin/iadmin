'use strict';

var acl = angular.module('acl', []);

angular.module('acl').service('acl.ACLConfig', ['$rootScope',

    function ($rootScope) {

        var roles = ["Administrator", "Approver", "Editor", "USEditor", "USApprover", "CSEditor", "CSApprover"];
        var aclsByMenu = {User : ["CreateUser", "ModifyUser", "ViewUser"],
            Roles : ["ViewRole"],
            UserRoles :["AddRoleToUser", "RemoveRoleFromUser", "ViewUserRole"],
            Carrier : ["CreateCarrier", "ModifyCarrier", "ViewCarrier"],
            Language : ["CreateLanguage", "ModifyLanguage", "ViewLanguage"],
            CarrierLanguages :["AddLanguageToCarrier", "RemoveLanguageFromCarrier", "ViewCarrierLanguage"],
            Maintenance : ["CreateConfiguration", "ReviewConfiguration", "ViewConfiguration"],
            Locales : ["CreateLocales", "ModifyLocales", "ViewLocales"],
            UniversalScripts : ["ListUniversalScripts", "ViewUniversalScripts", "CreateUniversalScripts", "ReviewUniversalScripts", "ModifyUniversalScripts", "ListUniversalScriptsHistory", "ViewUniversalScriptsHistory"],
            CarrierScripts : ["ListCarrierScripts", "ViewCarrierScripts", "CreateCarrierScripts", "ReviewCarrierScripts", "ModifyCarrierScripts", "ListCarrierScriptsHistory", "ViewCarrierScriptsHistory"],
            Import : ["ImportFile"],
            Export : ["ExportFile"],
            ServerEnvironment : ["AddServerEnvironment","RemoveServerEnvironment","ListServerEnvironment"],
            ActivateConfiguration : ["ActivateConfig"]
        };

        var aclByRole = [
            {
                role : roles[0],
                appliedAcl :[aclsByMenu.User, aclsByMenu.Roles, aclsByMenu.UserRoles,
                    aclsByMenu.Carrier, aclsByMenu.Language, aclsByMenu.CarrierLanguages,
                    aclsByMenu.Locales, [aclsByMenu.UniversalScripts[1]], [aclsByMenu.CarrierScripts[1]], 
                    [aclsByMenu.Maintenance[2]],aclsByMenu.ServerEnvironment,aclsByMenu.Import,aclsByMenu.Export,aclsByMenu.ActivateConfiguration]
            },
            {
                role : roles[1],
                appliedAcl :[aclsByMenu.Locales, [aclsByMenu.Maintenance[1]]]
            },
            {
                role : roles[2],
                appliedAcl :[aclsByMenu.Locales, [aclsByMenu.Maintenance[0]]]
            },
            {
                role : roles[3],
                appliedAcl :[[aclsByMenu.UniversalScripts[2]]]
            },
            {
                role : roles[4],
                appliedAcl :[[aclsByMenu.UniversalScripts[3]]]
            },
            {
                role : roles[5],
                appliedAcl :[[aclsByMenu.CarrierScripts[2]]]
            },
            {
                role : roles[6],
                appliedAcl :[[aclsByMenu.CarrierScripts[3]]]
            }
        ];

        var menus = [{name : "Home", allowedRoles:[roles[0], roles[1], roles[2], roles[3], roles[4], roles[5], roles[6]]},
            {name : "Users", allowedRoles:[roles[0]]},
            {name : "Roles", allowedRoles:[roles[0]]},
            {name : "UserRoles", allowedRoles:[roles[0]]},
            {name : "Carriers", allowedRoles:[roles[0]]},
            {name : "Languages", allowedRoles:[roles[0]]},			
            {name : "CarrierLanguages", allowedRoles:[roles[0]]},
            {name : "Configuration", allowedRoles:[roles[0], roles[1], roles[2]]},
            {name : "Maintenance", allowedRoles:[roles[0], roles[1], roles[2]]},
            {name : "ServerEnvironment", allowedRoles:[roles[0]]},
            {name : "Locales", allowedRoles:[roles[0], roles[1], roles[2]]},
            {name : "ErrorLocales", allowedRoles:[roles[0], roles[3], roles[4], roles[5], roles[6]]},
            {name : "UniversalScripts", allowedRoles:[roles[0], roles[3], roles[4]]},
            {name : "CarrierScripts", allowedRoles:[roles[0], roles[5], roles[6]]},
            {name : "Import", allowedRoles:[roles[0]]},
            {name : "Export", allowedRoles:[roles[0]]},
            {name : "ActivateConfig", allowedRoles:[roles[0]]}
        ]

        var AClConfig = {

            getMenus : function () {
                return menus
            },
            getRoles : function () {
                return roles;
            },
            getRolesByMenu : function (menu) {
                for (var i = 0; i < menus.length; i++) {
                    if (menus[i].name == menu) {
                        return menus[i].allowedRoles;
                    }
                }
                return null;
            },
            isAppliedAclToUser : function(acl) {

                var isApplied = false;
                var userRoles = $rootScope.assignedRoles;

                userRoles.forEach(function(role) {
                    aclByRole.forEach(function(rolesAcl) {
                        if (rolesAcl.role == role.Name) {
                            rolesAcl.appliedAcl.forEach(function(appAcl) {
                                if (appAcl.indexOf(acl) >= 0) {
                                    isApplied = true;
                                }
                            });
                        }
                    });
                });

                return isApplied;
            }
        }

        return AClConfig;
    }
]);