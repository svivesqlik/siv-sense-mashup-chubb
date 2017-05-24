'use strict';

//to avoid errors in workbench: you can remove this when you have added an app
var senseApp;

require.config({
    baseUrl: baseURL,
    'paths': {
        'templates': basePath + '/templates',
        'uirouter': basePath + '/lib/angular-ui-router.min',
        'sidebar': basePath + '/lib/jquery.sidebar.min',
        'cookies': basePath + '/lib/angular.cookies.min',
        'bootstrapjs': basePath + '/lib/bootstrap-custom',
        'textjs': basePath + '/lib/text',
        'introjs': basePath + '/lib/intro',
        'text':'.'
    },
    'shim': {
        'uirouter': ['angular'],
        'templates': ['angular'],
        'cookies': ['angular']
    }
});

requirejs.config({
    config: {
        text: {
            onXhr: function (xhr, url) {
                xhr.withCredentials = true;
            },
            useXhr: function (url, protocol, hostname, port) {
                return true;
            }
        }
    }
});


function loadTheme(name) {
    return $.get('themes/' + name + '.json')
        .then(function (data) {
            require.undef("text!themes/sense/theme.json");
            require.undef("text!themes/old/sense/theme.json");
            define("text!themes/old/sense/theme.json", [], function () {
                return JSON.stringify(data);
            });
            define("text!themes/sense/theme.json", [], function () {
                return JSON.stringify(data);
            });
        })
        .fail(function fail(err) {
            if (window.console) console.log(err);
        });
}



/***
 * Opens the applicaiton and bootstraps the angular app
 * that should be the last step in the process.
 */
function loadApp() {
    require([
        'js/qlik'
    ], function (qlik) {

        var $injector = angular.bootstrap(document, ["qMashup", "qlik-angular"]);

        qlik.setOnError(function (problem) {
            if (window.console) {
                console.log(problem);
            }
        });

        if (window.console) console.info('Opening app with id : ' + senseConnection.appName);

        senseApp = qlik.openApp(senseConnection.appName, senseConnection);

        senseApp.model.waitForOpen.promise.then(function () {
            $injector.invoke(function ($rootScope) {
                $rootScope.senseAppIsLoaded = true;
                $rootScope.qlik = qlik;
                $rootScope.$broadcast('senseapp-loaded');
            });
        });
    });
}


// Avoid Qlik to automatically bootstrap the application.
$('html').attr('qva-bootstrap', 'false');
$('body').addClass('loading');


require([],
    function () {
        loadTheme('chubb').then(function () {
            loadApp();
        });
    }
);

var app = angular
    .module('qMashup', [
        'ngRoute',
        'ngCookies',
        'ui.router',
        'templates-main'
    ]);

var app_dependencies = [
    'scripts/controllers/splashController.js',

    'uirouter',
    'templates',
    'sidebar',
    'introjs',
    'bootstrapjs',
    'cookies',
    
    'scripts/filters/urlConverter.js',
    'scripts/directives/directives.js',
    'scripts/services/routeServices.js',

    'scripts/controllers/globalRouteController.js',    
    'scripts/controllers/topBarController.js',
    'scripts/controllers/sideBarController.js'
];

var $routeProviderReference = null;
var mode = 'ROUTE_BASED'; //'STATE_BASED';

require(app_dependencies,
    function () {

        if (mode === 'ROUTE_BASED') {
            app.config(['$routeProvider',
                function ($routeProvider) {
                    $routeProviderReference = $routeProvider;
                }
            ]);
        }

        if (mode === 'STATE_BASED') {

            app.config(function ($stateProvider) {

                $stateProvider.state('intro', {
                    abstract: true,
                });

                var states_read = senseConnection.statesConfig[senseConnection.states];

                for (var key in states_read) {
                    var state_name = senseConnection.states + '_' + key;

                    if (Array.isArray(states_read[key])) {
                        for (var i = 0; i < states_read[key].length; ++i) {
                            var lang = states_read[key][i].languages;
                            var include_state = false;

                            if (Array.isArray(lang) && lang.indexOf(senseConnection.userLanguage) > -1) {
                                include_state = true;
                            } else if (lang === senseConnection.userLanguage ||
                                lang === '*') {
                                include_state = true;
                            }

                            if (include_state) {
                                var menu_location = '';
                                if (!senseConnection.startState) {
                                    senseConnection.startState = state_name;
                                }
                                var template_for_state = '../app/' + states_read[key][i].template;
                                if (states_read[key][i].menu) {
                                    menu_location = '../app/' + states_read[key][i].menu;
                                }
                                $stateProvider.state(state_name, {
                                    views: {
                                        main: {
                                            templateUrl: template_for_state
                                        },
                                        menu: {
                                            templateUrl: menu_location
                                        },
                                    }

                                });
                            }

                        }

                    } else {

                        var menu_location = '';
                        // This comes from a javascript file that caches 
                        var template_for_state = '../app/' + states_read[key].template;

                        if (states_read[key].menu) {
                            menu_location = '../app/' + states_read[key].menu;
                        }

                        console.info(state_name);

                        $stateProvider.state(state_name, {
                            views: {
                                main: {
                                    templateUrl: template_for_state
                                },
                                menu: {
                                    templateUrl: menu_location
                                },
                            }

                        });

                        if (!senseConnection.startState) {
                            senseConnection.startState = state_name;
                        }
                    }
                }

                $stateProvider.state('404', {
                    url: '404',
                    templateUrl: senseConnection.remoteServer + '/templates/404.html'
                });

            });
        }

        app.run([
            '$rootScope',
            '$http',
            '$route',
            '$location',
            '$routeParams',
            '$timeout',
            '$state',
            'routeServices',
            
            function (
                $rootScope,
                $http,
                $route,
                $location,
                $routeParams,
                $timeout,
                $state,
                routeServices
            ) {

                $rootScope.currentObjects = [];
                // @TODO 
                $rootScope.chartViewMode = 'mode-geo';
                $rootScope.headlinesChartViewMode = 'mode-monthly';
                $rootScope.pivotViewMode = 'mode-act-abs';

                if (mode === 'ROUTE_BASED') {
                    
                    // First thing, redirect if we got to the root
                    if ($location.path() === "") {
                        $location.path("/main-headlines");
                    }

                    // Load routes
                    var ts = Math.ceil(Math.random() * 1000);
                    routeServices.loadRoutes('config/routes.json?ts=' + ts.toString(), $routeProviderReference)
                        .then(routeServices.registerRouteChangeEvents);

                    $rootScope.defaultSection = 'main';
                     /*if ($location.path() === "" ||
                        $location.path() === "/"
                        ) {
                        $rootScope.defaultSection = 'main';
                    }*/


                } else if (mode === 'STATE_BASED') {

                    $rootScope.$on('senseapp-loaded', function () {
                        $state.go(senseConnection.startState);
                    });

                    $rootScope.$on('$stateChangeStart',
                        function (event, toState, toParams, fromState, fromParams) {
                            var currentObjectsClean = $rootScope.currentObjects;
                            angular.forEach(currentObjectsClean, function (obj, key) {
                                if (angular.element('#' + obj.id).scope()) {
                                    try {
                                        obj.close();
                                        angular.element('#' + obj.id).scope().$destroy();
                                        $('#' + obj.id).empty();
                                    } catch (e) {
                                        // noop
                                    }
                                }
                            });

                            // We've removed the objects that where on the domain
                            // this ain't needed anymore
                            $rootScope.currentObjects = [];
                        });


                }


                $rootScope.globalResize = function () {
                    console.log('Global resize called');
                    if (document.createEvent) { // W3C
                        var nonIeEvent = document.createEvent('Event');
                        nonIeEvent.initEvent('resize', true, true);
                        window.dispatchEvent(nonIeEvent);
                    } else { // IE
                        var docElement = document.documentElement;
                        var event = document.createEventObject();
                        docElement.fireEvent("onresize", event);
                    }
                };

                $rootScope.triggerResize = function () {
                    $timeout(function () {
                        $rootScope.globalResize();
                    }, 1000);
                    $timeout(function () {
                        $rootScope.globalResize();
                    }, 4000);
                };

                $rootScope.openPopup = function (objectID) {
                    var options = {

                    };
                    senseApp.getObject(objectID, objectID).then(function (model) {

                        if (model.layout.qHyperCube.qGrandTotalRow.length == 0) {
                            alert('There are too many rows to display. Please refine your selection to narrow down the results.');
                            return;
                        } 

                        // Either we have a totals table or a pivot one
                        require(['bootstrapjs'], function () {
                            var modal_obj = $('#mashupModal');
                            var obj = modal_obj.find('#modal-chart-object').find('.qs-object');
                            obj.css('opacity', 0);
                            modal_obj.modal(options);
                            modal_obj.on('shown.bs.modal', function () {
                                
                                obj.attr('id', 'pop_' + objectID);
                                senseApp.getObject('pop_' + objectID, objectID).then(function () {
                                    obj.css('opacity', 1.0);
                                    $rootScope.globalResize();
                                });
                            });
                        });
                    });
                    
                    
                };

                $rootScope.exportDataForChart = function (objectID) {
                    var container = element.parent();
                    container.css('opacity', 0.4);
                    try {
                        senseApp.getObject('exportData', objectID).then(function (vizModel) {
                            vizModel.exportData().then(function (reply) {
                                var forward_slash = false;
                                container.css('opacity', 1.0);
                                window.open(senseConnection.getServerUrl(forward_slash) + reply.result.qUrl);
                            });
                        });
                    } catch (e) {
                        container.css('opacity', 1.0);
                    }
                };


                $rootScope.togglePanelVisibility = function () {
                    
                    if (!$('.collapsible').hasClass('collapsed')) {
                        $('.collapsible').addClass('collapsed');
                        $('.collapse-trigger').addClass('collapsed');
                        $('.collapse-trigger').text('+ More details');
                    } else {
                        $('.collapsible').removeClass('collapsed');
                        $('.collapse-trigger').removeClass('collapsed');
                        $('.collapse-trigger').text('- Less details');

                        // Force the paint method after 1 second (the animation takes less
                        // though).
                        $timeout(function () {
                            $rootScope.globalResize();
                        }, 1000);
                        
                    }
                };

            }
        ]);
    }
);