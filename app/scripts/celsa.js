'use strict';

//to avoid errors in workbench: you can remove this when you have added an app
var senseApp;

require.config({
    baseUrl: (senseConnection.isSecure ? "https://" : "http://") + senseConnection.host + (senseConnection.port ? ":" + senseConnection.port : "") + senseConnection.prefix + "resources",
    'paths': {
        'uirouter': senseConnection.remoteServer + '/lib/angular-ui-router.min',
        'templates': senseConnection.remoteServer + '/templates'
    },
    'shim': {
        'uirouter': ['angular'],
        'templates': ['angular']
    }
});

function defineTheme() {
    require.undef("text!themes/sense/theme.json");
    require.undef("text!themes/old/sense/theme.json");
    define("text!themes/old/sense/theme.json", [], function () {
        return JSON.stringify(senseConnection.theme);
    });
    define("text!themes/sense/theme.json", [], function () {
        return JSON.stringify(senseConnection.theme);
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

        var $injector = angular.bootstrap(angular.element('#qlikEmbedContainer'), ["qMashup", "qlik-angular"]);

        qlik.setOnError(function (problem) {
            if (window.console) {
                console.log(problem);
            }
        });

        if (window.console) console.info('Opening app with id : ' + senseConnection.appName);

        senseApp = qlik.openApp(senseConnection.appName, senseConnection);

        senseApp.model.waitForOpen.promise.then(function () {

            if (window.console) console.info('App loaded!');

            var available_languages = senseApp.field('LanguageID').getData();
            var defined_langauges = [];

            available_languages.OnData.bind(function () {

                // Do not enter twice
                if (defined_langauges.length > 0) {
                    return;
                }            

                // Check if the language is available in the app.
                
                // Retrieve all registered in the app
                for (var i = 0; i < this.rows.length; ++i) {
                    defined_langauges.push(this.rows[i].qText);
                }
                var valid_language = senseConnection.userLanguage;
                if (defined_langauges.indexOf(senseConnection.userLanguage) < 0) {
                    // Default language, change here if you want fallback.
                    valid_language = 'EN';
                }

                // Now pick the right numeric format
                var valid_format = senseConnection.formats['default'];
                for (var fmt in senseConnection.formats['available']) {
                    var languages_for_format = senseConnection.formats['available'][fmt];
                    if (languages_for_format.indexOf(valid_language) > -1) {
                        // We have the formatting in place
                        valid_format = fmt;
                        break;
                    }   
                }

                senseApp.field('LanguageID')
                    .clear()
                    .then(senseApp.field('LanguageID').selectMatch(valid_language, true))
                    .then(senseApp.field('NumericDesc').clear())
                    .then(senseApp.field('NumericDesc').selectMatch(valid_format, true))
                    .then(function () {
                        $injector.invoke(function ($rootScope) {
                            $rootScope.senseAppIsLoaded = true;
                            $rootScope.qlik = qlik;
                            $rootScope.$broadcast('senseapp-loaded');
                        });
                    });

            });
        });
    });
}


// Avoid Qlik to automatically bootstrap the application.
$('html').attr('qva-bootstrap', 'false');

require([
        senseConnection.remoteServer + '/themes/celsa_theme.js',
        senseConnection.remoteServer + '/config/states.js',
        senseConnection.remoteServer + '/config/formats.js'
    ],
    function () {
        defineTheme();
        loadApp();
    }
);

var app = angular
    .module('qMashup', [
        'ngRoute',
        'ui.router',
        'templates-main'
    ]);

var app_dependencies = [
    'uirouter',
    'templates'
];

require(app_dependencies,
    function (cg, cs, rout, states) {
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

        app.run([
            '$rootScope',
            '$http',
            '$route',
            '$location',
            '$routeParams',
            '$timeout',
            '$state',
            function (
                $rootScope,
                $http,
                $route,
                $location,
                $routeParams,
                $timeout,
                $state
            ) {

                $rootScope.$on('senseapp-loaded', function () {
                    $state.go(senseConnection.startState);
                });

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
                    }, 2000);
                    $timeout(function () {
                        $rootScope.globalResize();
                    }, 8000);
                    $timeout(function () {
                        $rootScope.globalResize();
                    }, 16000);
                };

                $rootScope.currentObjects = [];
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
                
                // When the HTML is loaded, then we get all the charts
                // and load them.
                $rootScope.$on('$viewContentLoaded',
                    function () {
                        var chartObjects = angular.element('.celsa-qs-chart');

                        angular.forEach(chartObjects, function (obj, key) {
                            var chart_obj = angular.element(chartObjects[key]);
                            var id = angular.element(chartObjects[key]).attr('id');
                            
                            senseApp.getObject(
                                id,
                                id, {}
                            ).then(function (d) {
                                $rootScope.currentObjects.push(d);
                                $rootScope.triggerResize();
                            });

                            chart_obj.prepend('<span class="excel-export" ng-click="exportDataForChart(' + id + ')">Export to Excel</span>');

                        });
                });

                
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
            }
        ]);
    }
);