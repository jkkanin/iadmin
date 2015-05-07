'use strict';

angular.module('config').controller('config.ImportCtrl', ['$scope', 'config.ConfiguredVersions', 'config.ConfiguredCarriers',
    'config.Service',  'config.Constants',
    function ($scope, ConfiguredVersions, ConfiguredCarriers, Service, Constants) {

        $scope.setFiles = function(element) {
            $scope.$apply(function(scope) {
                if (element.files && element.files.length > 0) {
                    scope.file = element.files[0];
                    $("span.file-input-name").hide();
                }
            });
            $scope.imported = false;
        };
        $scope.firsttime = false;

        $scope.uploadFile = function() {

            $scope.firsttime = true;
            if (!$scope.importform.$valid) {
                return;
            }
            var fileName = $scope.file.name;
            var ext = fileName.substr(fileName.lastIndexOf('.') + 1);
            if (!ext || ext.toLowerCase() != 'sql') {
                $scope.errorMsg = ".sql file only allowed to upload";
                return;

            }
            $scope.errorMsg = "";
            var fd = new FormData();

            fd.append("resourceFile", $scope.file);
            fd.append("description", $scope.description);

            var xhr = new XMLHttpRequest();
            xhr.upload.addEventListener("progress", $scope.uploadProgress, false);
            xhr.addEventListener("load", $scope.uploadComplete, false);
            xhr.addEventListener("error", $scope.error, false);
            xhr.addEventListener("abort", $scope.uploadCanceled, false);
            xhr.open("POST", Constants.serviceURL + Constants.url.ImportFromSQLFile);

            xhr.send(fd)
        }

        $scope.uploadProgress = function(evt) {
            $scope.$apply(function() {
                $scope.uploading = true;
            });
        }
        $scope.uploadComplete = function(evt) {
            $scope.$apply(function() {
                $scope.uploading = false;
                $scope.firsttime = false;
                $scope.imported = true;
            });
        }
        $scope.uploadFailed = function(evt) {
            alert("There was an error attempting to upload the file.")
        }
        $scope.uploadCanceled = function(evt) {
            alert("The upload has been canceled by the user or the browser dropped the connection.")
        }
    }
]);