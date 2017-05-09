"use strict";

angular.module('jsonService', ['ngResource'])
    .factory('JsonService', function ($resource) {
        return $resource('json/routes.json');
});

app.factory('routeServices', ['$rootScope', '$http', '$location', '$route',
            function ($rootScope, $http, $location, $route) {
                var _service = {
                    routeConverterWhen: function (string,key) {
                        string = string.replace(/\s+/g, '-').toLowerCase();
                        key = key.replace(/\s+/g, '-').toLowerCase();

                        if(key === "infografia"){
                            return "/" + string
                        }else{
                            return "/" + key + "-" + string;
                        }
                    },
                    sectionConverterWhen : function(string) {
                        return string.replace(/\s+/g, '-').toLowerCase();
                    },
                    registerRouteChangeEvents:function () {

                         $rootScope.$on('$routeChangeStart', function (next, current) {
                            var currentObjectsClean = $rootScope.currentObjects;
                            //console.log('Cleaning:', currentObjectsClean);
                            angular.forEach(currentObjectsClean, function (obj, key) {

                                if ($rootScope.globalObjects.indexOf(obj.id) > -1) {
                                    // noop, we don't want to do anything here as
                                    // it's a global object.
                                    //console.log('Not cleaning cleaning with id:' +  obj.id + ' as its global');
                                } else {
                                    //console.log('Cleaning with id:', obj.id);
                                    var o_scope = angular.element('#' + obj.id).scope();
                                    if (o_scope) {
                                        o_scope.$destroy();
                                        obj.close();
                                    }
                                    $('#' + obj.id).empty();
                                }
                            });
                        });

                        var history = [];
                        $rootScope.$on('$routeChangeSuccess', function (e, current, pre) {                        

                            $rootScope.path = $location.path();
                            if ($route.routes) {
                                $rootScope.pageClassCSS = $location.path().replace('/', "");
                                $rootScope.section = $route.routes[$location.$$path].section;
                                $rootScope.parent = $route.routes[$location.$$path].parent;
                                $rootScope.pageTitle = $route.routes[$location.$$path].pageTitle;
                                history.push($route.routes[$location.$$path].sheetID);
                                $rootScope.prevUrl = history.length > 1 ? history[history.length - 2] : "none";
                            }

                        });

                    },
                    loadRoutes:function (frompath, routeProviderReference) {
                        
                        return $http.get(frompath)
                            .success(function (data) {

                            $rootScope.navLinks = data;
                            $rootScope.globalSearchFields = [];
                            $rootScope.availableLanguages = [];

                            angular.forEach(data, function (data1,key) {

                                if (key === 'globalObjects') {

                                    if (!$rootScope.globalObjects) {
                                        $rootScope.globalObjects = [];
                                    }
                                    $.merge($rootScope.globalObjects, data1.gObjectIDs);
                                    $.merge($rootScope.globalSearchFields, data1.searchFields);

                                } else {                
                                    angular.forEach(data1, function (route, subkey) {
                                        var first_when = _service.routeConverterWhen(route.title,key);
                                        var first_section = _service.sectionConverterWhen(route.title);

                                        routeProviderReference.when(first_when, {
                                            templateUrl: route.template,
                                            controller: 'globalRouteController',
                                            sheetID: route.sheetID,
                                            pageTitle: route.title,
                                            section: first_section,
                                            parent: key,
                                            subItems: route.subItems,
                                            gObjectIDs: route.gObjectIDs,
                                            hidden: route.hidden
                                        });

                                        $rootScope.navLinks[key][subkey]['parent'] = key;
                                        $rootScope.navLinks[key][subkey]['section'] = first_section;

                                        angular.forEach(route.subLinks, function (item, third_key) {
                                            var section = _service.sectionConverterWhen(item.title);
                                            var when = _service.routeConverterWhen(item.title, key);

                                            routeProviderReference.when(when, {
                                                    templateUrl: item.template,
                                                    controller: 'globalRouteController',
                                                    sheetID: item.sheetID,
                                                    pageTitle: item.title,
                                                    section: section,
                                                    parent: first_section,
                                                    gObjectIDs: item.gObjectIDs,
                                                    hidden: item.hidden
                                            });

                                            $rootScope.navLinks[key][subkey]['parent'] = first_section;
                                            $rootScope.navLinks[key][subkey].subLinks[third_key]['section'] = first_section;

                                            if(item.subLinks){

                                                angular.forEach(item.subLinks, function (subItem) {

                                                    var section = _service.sectionConverterWhen(subItem.title)
                                                    var when = _service.routeConverterWhen(subItem.title,key)
                                                    routeProviderReference.when(when, {
                                                        templateUrl: subItem.template,
                                                        controller: "globalRouteController",
                                                        sheetID: subItem.sheetID,
                                                        pageTitle: subItem.title,
                                                        section: section,
                                                        gObjectIDs: subItem.gObjectIDs,
                                                        hidden: subItem.hidden
                                                    });
                                                });
                                            }
                                        });
                                    
                                    });
                                }

                                });
    
    
                                $rootScope.$broadcast('routeconfig-loaded');
                                $route.reload();
                        });

                        $routeProviderReference.otherwise({
                            redirectTo: '/main-intro'
                        });
                        
                    }
            };

            return _service;
        }
]);

