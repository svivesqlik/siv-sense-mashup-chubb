'use strict';

app.controller('globalRouteController', [
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
                    noInteraction: true,
                    noSelections: true
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
            });

            $scope.code = objectsHtml;
        };


        $rootScope.initRouteController = function () {
            $rootScope.currentObjects = [];
            $rootScope.hideFilters = [];
            var promises = [];
            console.info('Setting timeout to start loading sheet objects...');
            console.info('Start loading objects...');

            var chartObjects = angular.element('.qs-object');
            var needsExport = {};

            angular.forEach(chartObjects, function (obj, key) {
                var chart_obj = angular.element(chartObjects[key]);
                var id = angular.element(chartObjects[key]).attr('id');
                // Safe check, don't want to fetch an object with empty id
                if (id) {
                    var options = {};

                    if ($(obj).hasClass('kpi-spark') || $(obj).hasClass('noselect')) {
                        options = {
                            noInteraction: true,
                            noSelections: true
                        };
                    }                    

                    console.info('Getting object with ID: ', obj.id);
                    promises.push(
                        senseApp.getObject(
                            id,
                            id,
                            options
                        ).then(function (obj) {
                            console.info('GOT object with ID: ', obj.id);
                            
                            try {
                                $rootScope.currentObjects.push(obj);
                            } catch (e) {}
                            
                        })
                    );
                }
            });

            // Resize the global window after some time when objets are loaded
            // this helps make sure stuff gets drawn.
            $q.all(promises).then(function () {
                $rootScope.triggerResize();
            });
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