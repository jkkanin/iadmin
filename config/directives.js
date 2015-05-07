'use strict';

/* Directives for pageFlow module*/
angular.module('config').directive("leftPanel",[function () {
    return {

        restrict : "E",
        templateUrl : 'templates/config/leftPanel.html',

        link : function (scope, element, attrs) {

        }
    }
}]);
angular.module('config').directive("rightPanel",[function () {
    return {

        restrict : "E",
        templateUrl : 'templates/config/rightPanel.html'
    }
}]);
angular.module('config').directive("dropdown", ['$compile',
    function ($compile) {
        return {
            restrict : "E",
            replace : false,

            link : function (scope, element, attrs) {

                var children =  element.children();
                var div = $('<div class="section"></div>');

                var heading = $('<h3 class="subheading">' + attrs.labletitle + (attrs.link ?
                                 '<a href="" data-ng-hide="!creator" id="Add' + attrs.labletitle + '" placement="' + attrs.placement + '"'
                                    + ' addpopover="' + attrs.labletitle + '" class="addlnk">'
                                    + attrs.link + "</a>" : "")
                                 + "</h3>");

                var btnGroup = $('<div class="btn-group"></div>');

                var anchor = $('<a class="editpopover btn dropdown-toggle" data-toggle="dropdown"'
                                + (attrs.editable ? 'id ="editpopover' + attrs.labletitle + '"' : '') + '></a>');

                var placeHolder = $('<span class="' + attrs.labletitle + '" >' + attrs.placeholder + '</span>');

                var icon = $('<span class="caret"' + (attrs.editable ? 'id="' + attrs.labletitle
                                + '" placement="' + attrs.placement
                                + '" popover="' + attrs.labletitle + '"' : '') + '/>');

                anchor.append(placeHolder, icon);
                btnGroup.append(anchor, children);

                if (attrs.noheading) {
                    div.append( btnGroup);
                } else {
                    div.append(heading, btnGroup);
                }

                div = $compile(div)(scope);
                element.append(div);
            }
        }
    }]);
angular.module('config').directive("list", ['$compile',
    function ($compile) {
        return {

            restrict : "E",
            replace : true,

            link : function (scope, element, attrs) {

                var ul = $('<ul ' + (attrs.dropdownlist ?  'class="dropdown-menu"' : '') + '></ul>');
                var li;

                if (attrs.dropdownlist) {

                    li = $('<li data-ng-repeat="' + attrs.collectionlist
                            + '" data-ng-click="' + attrs.clickaction + '">{{' + attrs.displaytext + '}}</li>');
                } else {

                    li = $('<li class="btn" ' + (attrs.ngclass ? 'data-ng-class="' + attrs.ngclass + '"' : '') +'data-ng-repeat="' + attrs.collectionlist + '"></li>');

                    var btndiv = $('<div class="btnText" data-ng-click="' + attrs.clickaction + '"/>');

                    var text = $('<span class="lead">{{' + attrs.displaytext + '}}</span>');

                    var icon = $('<i class="icon-pencil pull-right {{' + attrs.iconclass + '}}" id="{{' + attrs.name + '}}"'
                                    + (attrs.iconclickaction ? ' data-ng-click="' + attrs.iconclickaction + '"' : '')
                                    + ' placement="' + attrs.placement + '"'
                                    + ' popover="' + attrs.labletitle + '" '
                                    + ' popovertitle="{{' + attrs.popovertitle + '}}" '
                                    + ' index="{{$index}}"></i>');

                    btndiv.append(text, icon);
                    li.append(btndiv)
                }

                ul.append(li);
                ul = $compile(ul)(scope);
                element.replaceWith(ul);
            }
        }
}]);

angular.module('config').directive("popover", ['$compile', '$http', '$templateCache',
    function($compile, $http, $templateCache) {

    return {

        restrict: 'A',
        link : function (scope, element, attrs) {

            element.click(function(event) {
                event.preventDefault();
                event.stopPropagation();

                var selectedItem = null;
                switch (attrs.popover) {
                    case "Version" :
                        selectedItem = scope.selectedVersion;
                        break;
                    case "Wizard" :
                        selectedItem = scope.selectedWizard;
                        scope.loadAppWizard(selectedItem);
                        break;
                    case "Page" :
                        selectedItem = scope.selectedPage;
                        scope.loadAppPage(selectedItem);
                        break;
                    case "SubPage" :
                        selectedItem = scope.selectedSubPage;
                        break;
                    case "Pane" :
                        if (scope.panes) {
                            selectedItem = scope.panes[attrs.index];
                            scope.editablePaneFields = selectedItem.getFields();
                        }
                        break;
                    case "Field" :
                        selectedItem = scope.selectedField;
                }

                if (selectedItem && !scope.popovershown) {

                    scope['cloned' + attrs.popover] = angular.copy(selectedItem);
                    scope['editable' + attrs.popover] = selectedItem;
                    scope.isAdd = false;
                    scope.popovershown = true;

                    $http.get('templates/config/' + attrs.popover + ".html")
                        .success(function(html) {
                            element.popover({
                                html : true,
//                                trigger : 'none',
                                placement : attrs.placement,
                                title : attrs.popovertitle ? attrs.popovertitle  : attrs.id,
//                                hideOnHTMLClick : true,
                                content : $compile(html)(scope),
                                container : 'popupcontainer'
                            }).popover('show');
                        });
                }
            });
        }
    };
}]);

angular.module('config').directive("panelLayout", ['$compile',
    function ($compile) {
        return {
            restrict : "E",
            replace : false,

            link : function (scope, element, attrs) {

                var children =  element.children();
                var div = $('<div></div>');

                var heading = $('<h4 class="subheading">' + attrs.labletitle
                                + (attrs.link ? '<a href="" id="'  + attrs.name + '" data-ng-hide="!creator"'
                                    + ' placement="' + attrs.placement + '"'
                                    + ' popovertitle="' + attrs.popovertitle + '"'
                                    + ' addpopover="' + attrs.labletitle + '" class="addlnk">'
                                    + attrs.link + '</a>' : '')
                                + "</h4>");

                var btnGroup = $('<div class="panel"></div>');

                btnGroup.append( children);
                div.append(heading, btnGroup);
                div = $compile(div)(scope);
                element.append(div);
            }
        }
}]);

angular.module('config').directive("addpopover", ['$compile', '$http','config.ConfigurationIdGenerator',
    'config.Wizard', 'config.Page','config.SubPage','config.Pane','config.Field',
    function($compile, $http, ConfigurationIdGenerator, Wizard, Page, SubPage, Pane, Field) {
        return {

            restrict: 'A',
            link : function (scope, element, attrs) {

                element.click(function(event) {

                    event.preventDefault();
                    event.stopPropagation();

                    var showPopover = false;
                    switch (attrs.addpopover) {

                        case "Wizard" :

                            if (scope.selectedVersion) {
                                showPopover = true;
                                scope.editableWizard = new Wizard({
                                    VersionId : scope.selectedVersion.getId(),
                                    Id : ConfigurationIdGenerator.getNextWizardId(),
                                    Pages : []
                                });
                                scope.loadAppWizard(scope.editableWizard);
                            }

                            break;
                        case "Page" :
                            if (scope.selectedWizard) {
                                showPopover = true;
                                scope.editablePage = new Page({
                                    WizardId : scope.selectedWizard.getId(),
                                    Id : ConfigurationIdGenerator.getNextPageId(),
                                    SubPages : []
                                });
                                scope.loadAppPage(scope.ediatblePage);
                            }
                            break;
                        case "SubPage" :
                            if (scope.selectedPage) {
                                showPopover = true;
                                scope.editableSubPage = new SubPage({
                                    PageId :scope.selectedPage.getId(),
                                    Id : ConfigurationIdGenerator.getNextSubPageId(),
                                    Panes : []
                                });
                            }
                            break;
                        case "Pane" :
                            if (scope.selectedSubPage) {
                                showPopover = true;
                                scope.editablePane = new Pane({
                                    SubPageId : scope.selectedSubPage.getId(),
                                    Id : ConfigurationIdGenerator.getNextPaneId(),
                                    Fields : []
                                });
                            }
                            break;
                        case "Field" :
                            if (scope.selectedPane) {
                                showPopover = true;
                                scope.editableField = new Field({
                                    PaneId : scope.selectedPane.getId(),
                                    Id: ConfigurationIdGenerator.getNextFieldId()
                                });
                            }
                    }

                    if (showPopover && !scope.popovershown) {

                        scope.isAdd = true;
                        scope.popovershown = true;

                        $http.get('templates/config/' + attrs.addpopover + ".html")
                            .success(function(html) {
                                element.popover({
                                    html : true,
//                                    trigger : 'none',
                                    placement : attrs.placement,
                                    title : attrs.popovertitle ? attrs.popovertitle  : attrs.id,
//                                    hideOnHTMLClick : true,
                                    content : $compile(html)(scope),
                                    container : 'popupcontainer'
                                }).popover('show');
                        });
                    }
                });
            }
        };
    }]);

angular.module('config').directive("modalUrl", ['$compile', '$http',
    function($compile, $http) {
        return {

            restrict: 'A',
            link : function (scope, element, attrs) {

                scope.$on('modalClose', function() {
                    $($(attrs.$$element).parents('form')[0].elements).removeAttr('disabled');
                    $($(attrs.$$element).parents('form')[0]).find('.' + attrs.buttondiv).show();
                });
                element.click(function(event) {

                    $($(this).parents('form')[0].elements).attr('disabled', 'disabled')
                    $($(this).parents('form')[0]).find('.' + attrs.buttondiv).hide();

                    $http.get('templates/main/' + attrs.modalUrl + ".html")
                        .success(function(html) {
                            $('body').append($compile(html)(scope));
                        });
                });
            }
        };
    }]);

angular.module('config').directive("modalDialogUrl", ['$compile', '$http',
    function($compile, $http) {
        return {

            restrict: 'A',
            link : function (scope, element, attrs) {

                element.click(function(event) {

                    $http.get('templates/main/' + attrs.modalDialogUrl + ".html")
                        .success(function(html) {
                            $('body').append($compile(html)(scope));
                    });
                });
            }
        };
    }]);

	angular.module('config').directive("resize",['$window',
      function ($window) {
	    return {

	        link : function (scope, element, attrs) {

	        	element.attr('style', 'height:' + ($window.innerHeight - attrs.resize) + 'px !important; overflow-y: auto; overflow-x:hidden;');
                angular.element($window).bind('resize', function () {
                	element.attr('style', 'height:' + ($window.innerHeight - attrs.resize) + 'px !important; overflow-y: auto; overflow-x:hidden;');
                });
	        }
	    }
	}]);
	
	angular.module('config').directive('spaceRestriction', function () {
	    return  {
	    	restrict: "C",
	        link: function (scope, elm, attrs, ctrl) {

	        	elm.on('keydown', function (event) {
	                if (event.which == 32 && event.target.value.length <= 0) {
	                	event.preventDefault();
	                }
	                else if (event.target.value.length > 0)
                    {
                        var cursorPos = null;
                        if (event.target.createTextRange) {
                            var range = document.selection.createRange().duplicate()
                            range.moveEnd('character', event.target.value.length)
                            if (range.text == '') cursorPos = event.target.value.length
                            cursorPos =  event.target.value.lastIndexOf(range.text)
                        } 
                        else 
                            cursorPos =  event.target.selectionStart
                        
                        if(cursorPos == 0 && event.which == 32)
                        {
                           event.preventDefault();
                        }
                    }
	            });
	        }
	    }
	});
