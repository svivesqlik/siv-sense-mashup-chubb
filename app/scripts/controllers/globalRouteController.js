'use strict';

app.controller('globalRouteController', 
[
    '$timeout', 
    '$scope', 
    '$rootScope', 
    '$route', 
    '$location', 
    '$window', 
    '$q',
    function (
        $timeout,
        $scope,
        $rootScope,
        $route,
        $location,
        $window,
        $q
    ) {
      
        $rootScope.generateObjectCodes = function (model) {
            var promises = [];            
            var objectsHtml = '<h4>Sheet Objects (' + model.propertyTree.qChildren.length + ')</h4><code>';            
            var children = model.propertyTree.qChildren;
            for (var i = 0; i < model.propertyTree.qChildren.length; i++) {

                var options = {
                    noInteraction: true, noSelections: true
                };

                var target_object = document.getElementById(children[i].qProperty.qInfo.qId);
                if (!target_object) {
                    console.error('Could not find the target object (where to put the visualization) for the visualization with id ' + document.getElementById(children[i].qProperty.qInfo.qId))
                }

                promises.push(
                    senseApp.getObject(document.getElementById(children[i].qProperty.qInfo.qId), children[i].qProperty.qInfo.qId, options).then(function (obj) {
                    
                    console.info('GOT object with ID: ', obj.id);

                    if (obj.layout && obj.layout.visualization && obj.layout.visualization == 'kpi') {
                        var title = $('#kpi-title-' + obj.id);

                        if (title.length > 0) {
                            title.text(obj.layout.title);
                        }

                    }
                    
                    $rootScope.currentObjects.push(obj);
                    })
                );
            }
            objectsHtml += '</code>';

            $q.all(promises).then(function () {
                $rootScope.$emit('all-kpis-loaded');
                $rootScope.globalResize();
            });

            $scope.code = objectsHtml;
        };


        $rootScope.initRouteController = function () {
            $rootScope.currentObjects = [];
            $rootScope.hideFilters = [];
            console.info('Setting timeout to start loading sheet objects...');
            $timeout(function () {
                console.info('Start loading objects...');
                if ($route.routes[$location.$$path].sheetID instanceof Array) {
                    for (var i = 0; i < $route.routes[$location.$$path].sheetID.length; ++i) {
                        var sheetID = $route.routes[$location.$$path].sheetID[i];
                        senseApp.getFullPropertyTree(sheetID).then(function (model) {
                            $rootScope.generateObjectCodes(model);
                        });
                    }

                } else {
                    var sheetID = $route.routes[$location.$$path].sheetID;
                    senseApp.getFullPropertyTree(sheetID).then(function (model) {
                        $rootScope.generateObjectCodes(model);
                    });
                }

                // Resize the global window after some time when objets are loaded
                // this helps make sure stuff gets drawn.
                $timeout($rootScope.globalResize, 3000);
                $timeout($rootScope.globalResize, 10000);

            }, 5000);
        };

        $rootScope.$on('senseapp-loaded', function (args) {
            args.currentScope.$root.initRouteController();
        });

        // When the application has loaded correctly, then
        // just trigger it to run.
        if ($rootScope.senseAppIsLoaded) {
            $rootScope.initRouteController();
        }

    }
]);


