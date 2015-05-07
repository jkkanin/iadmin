'use strict';

angular.module('config').service('config.Service', ['config.Constants', '$http', '$rootScope',

    function (Constants, $http, $rootScope) {

        var response = {

            ajaxCall : function(type, url, async) {

                var data = $.ajax({type: type,
                    url: Constants.serviceURL + url,
                    async: async
                }).responseText;
                return angular.fromJson(data);
            },

            httpCall : function(type, url, success, failure, postData) {

                var options =    {
                    method: type,
                    url: Constants.serviceURL + url,
                    data : postData,
                    headers : {'iWeb-User' : $rootScope.username}
                };

                if (type == "DELETE") {
                    options.headers = {"content-type" : "application/json; charset=utf-8",'iWeb-User' : $rootScope.username};
                }

                $rootScope.loading = true;
                var http = $http(options).success(function(data, status, headers, config) {
                    $rootScope.loading = false;
                    if (success) {
                        success(data, status, headers, config);
                    }
                }).error(function(data, status, headers, config) {

                    $rootScope.loading = false;
                    if (failure) {
                        failure(data, status, headers, config);
                    }
                });
            }
        }

        return response;
    }]);

angular.module('config').service('config.ConfiguredVersions',['config.Version', 'config.Constants', 'config.Service',

    function (Version, Constants, Service) {

        var versions = {
            getVersions : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllApprovedVersions, false),
                    function toVersion(versionsData) {
                        return new Version(versionsData);
                    });
            }
        };

        return versions;
}]);

angular.module('config').service('config.ConfiguredCarriers',['config.Carrier', 'config.Constants', 'config.Service',

    function (Carrier, Constants, Service) {

        var carriers = {
            getCarriers : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllCarriers, false),
                    function toCarrier(carrierData) {
                        return new Carrier(carrierData);
                    });
            }
        };

        return carriers;
    }]);

angular.module('config').service('config.ConfiguredLanguages',['config.Language', 'config.Constants', 'config.Service',

    function (Language, Constants, Service) {

        var languages = {
            getLanguages : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllLanguages, false),
                    function toCarrier(languagesData) {
                        return new Language(languagesData);
                    });
            }
        };

        return languages;
}]);

angular.module('config').service('config.ConfiguredUsers',['config.User', 'config.Constants', 'config.Service',

    function (User, Constants, Service) {

        var users = {
            getUsers : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllUsers, false),
                    function toUser(userData) {
                        return new User(userData);
                    });;
            }
        };

        return users;
    }]);

angular.module('config').service('config.ConfiguredRoles',['config.Role', 'config.Constants', 'config.Service',

    function (Role, Constants, Service) {

        var roles = {
            getRoles : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllRoles, false),
                    function toRole(roleData) {
                        return new Role(roleData);
                    });;
            }
        };

        return roles;
    }]);

angular.module('config').service('config.ConfiguredLocales',['config.AppLocale', 'config.Constants', 'config.Service',

    function (AppLocale, Constants, Service) {

        var AppLocales = {
            getAppLocales : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllAppLocales, false),
                    function toAppLocale(appLocaleData) {
                        return new AppLocale(appLocaleData);
                    });
            }
        };

        return AppLocales;
    }]);

angular.module('config').service('config.ConfiguredErrorLocales',['config.AppError', 'config.Constants', 'config.Service',

    function (AppError, Constants, Service) {

        var AppErrors = {
            getAppErrors : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllAppError, false),
                    function toAppError(appErrorData) {
                        return new AppError(appErrorData);
                    });
            }
        };

        return AppErrors;
    }]);

angular.module('config').service('config.AppConfiguration',['config.AppWizard', 'config.AppPage', 'config.AppField',
    'config.Constants', 'config.Service',

    function (AppWizard, AppPage, AppField, Constants, Service) {

        var AppConfiguartion = {
            getAppWizards : function() {
                return arrayOfObjectToArrayOfPrototype(Service.ajaxCall("GET", Constants.url.GetAllAppWizards, false),
                    function toAppWizards (appWizardData) {
                        return new AppWizard(appWizardData);
                    });
            },
            getAppPagesByAppWizardId : function(id) {
                return arrayOfObjectToArrayOfPrototype(
                    Service.ajaxCall("GET", Constants.url.GetAllAppPagesByAppWizardId + "/" + id, false),
                    function toAppPages (appPageData) {
                        return new AppPage(appPageData);
                    });
            },
            getAppFieldsByAppPageId : function(id) {
                return arrayOfObjectToArrayOfPrototype(
                    Service.ajaxCall("GET", Constants.url.GetAllAppFieldsByAppPageId + "/" + id, false),
                    function toAppFields (appFieldData) {
                        return new AppField(appFieldData);
                    });
            }
        };

        return AppConfiguartion;
    }]);

angular.module('config').service('config.Constants',[

    function () {

        var constants = {
            serviceURL : "/iweb-adminconsole/api/",
            url : {

                GetDashboardInfo : "workflow/GetDashBoardInfo?username=",
                UpdateDashboardInfo : "workflow/UpdateWorkflowAction?Id=",
                AddWorkflowAction : "workflow/AddWorkflowAction?Id=",

                GetAllVersions: "config/GetAllVersions",
                GetAllApprovedVersions : "config/GetAllApprovedVersions",
                GetConfiguration : "config/GetConfiguration/",
                AddConfiguration : "config/AddConfiguration",
                UpdateConfiguration : "config/UpdateConfiguration/",
                GetVersionById : "config/GetVersionById",
                CanCreateNewVersion : "config/CanCreateNewVersion",

                GetAllAppWizards : "config/GetAllAppWizards",
                GetAllAppPagesByAppWizardId : "config/GetAllAppPagesByAppWizardId",
                GetAllAppFieldsByAppPageId : "config/GetAllAppFieldsByAppPageId",

                GetAllCarriers : "config/GetAllCarriers",
                GetAllLanguages : "config/GetAllLanguages",

                AddCarrierLanguage : "config/AddCarrierLanguage",
                DeleteCarrierLanguage : "config/DeleteCarrierLanguage",
                GetAllLanguagesByCarrierId : "config/GetAllLanguagesByCarrierId",

                UpdateCarrier : "config/UpdateCarrier",
                AddCarrier : "config/AddCarrier",
                GetCarrierById : "config/GetCarrierById",

                UpdateLanguage : "config/UpdateLanguage",
                AddLanguage : "config/AddLanguage",

                GetAllAppLocales : "config/GetAllAppLocale",
                GetAllCarrierLocales : "config/GetAllCarrierLocalesById",
                AddLocaleandDetail : "config/AddLocaleandDetail",
                GetLocaleDetailsbyLocaleId : "config/GetLocaleDetailsbyLocaleId",

                GetError : "error/GetError",
                GetAllError : "error/GetAllError",
                removeErrors : "error/RemoveError",
                saveError : "error/AddError",
                saveErrorHistory : "error/AddErrorHistory",
                GetAllErrorHistory: 'error/GetAllErrorHistory',
                RollbackErrorHistory: 'error/RollbackErrorHistory',
                GetAllAppError : "error/GetAllAppError",
                GetAllCarrierErrorLocalesById : "error/GetAllCarrierErrorLocalesById",
                AddErrorandDetail : "error/AddErrorandDetail",
                GetErrorLocaleDetailByLocaleId : "error/GetLocaleDetailsbyLocaleId",
                updateAppErrorStatus : "error/UpdateAppErrorStatus",
                getErrorDashboardInfo : "error/GetErrorDashboardInfo",
                
                SearchCarrierErrorLocales : "error/SearchCarrierErrorLocales",
                ReplaceCarrierErrorLocales : "error/ReplaceCarrierErrorLocales",

                AddUser : "user/AddUser",
                DeleteUserById : "user/DeleteUserById",
                DeleteUser : "user/DeleteUser",
                GetAllUsers : "user/GetAllUsers",
                GetUserById : "user/GetUserById",
                UpdateUser : "user/UpdateUser",

                GetAllRoles : "user/GetAllRoles",
                GetRoleById : "user/GetRoleById",

                GetAllRolesByUserId : "user/GetAllRolesByUserId",
                AddUserRole : "user/AddUserRole",
                DeleteUserRole : "user/DeleteUserRole",

                ChangePassword : "user/ChangePassword",

                ExportToSQLFile : "importExport/exportToSQLFile",
                ImportFromSQLFile : "importExport/importFromSQLFile",
                GetImportedConfigurations : "importExport/getImportedConfigurations",
                ActivateConfiguration : "importExport/activateConfiguration",
                GetServerEnvs : "serverEnv/getServerEnvs",
                SaveServerEnv : "serverEnv/saveServerEnv",
                RemoveServerEnvs : "serverEnv/removeServerEnv"
            }
        }

        return constants ;
    }]);

angular.module('config').service('config.ConfigurationIdGenerator', [

    function () {

        var nextWizardId = 20000;
        var nextPageId = 21000;
        var nextSubPageId = 22000;
        var nextPaneId = 23000;
        var nextFieldId = 24000;

        var ConfigurationIdGenerator = {

            getNextWizardId : function () {
                return nextWizardId++;
            },
            getNextPageId : function () {
                return nextPageId++;
            },
            getNextSubPageId : function () {
                return nextSubPageId++;
            },
            getNextPaneId : function () {
                return nextFieldId++;
            },
            getNextFieldId : function () {
                return nextFieldId++;
            }

        }
        return ConfigurationIdGenerator;
    }]);