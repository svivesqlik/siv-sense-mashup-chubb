'use strict';

app.directive('progressBar', [function () {

    return {
        restrict: 'E',
        scope: {
            curVal: '@',
            maxVal: '@'
        },
        template: "<div class='progress-bar'>" +
            "<div class='progress-bar-bar'></div>" +
            "</div>",

        link: function ($scope, element, attrs) {

            function updateProgress() {
                var progress = 0;

                if ($scope.maxVal) {
                    progress = Math.min($scope.curVal, $scope.maxVal) / $scope.maxVal * element.find('.progress-bar').width();
                }

                element.find('.progress-bar-bar').css('width', progress);
            }

            $scope.$watch('curVal', updateProgress);
            $scope.$watch('maxVal', updateProgress);
        }
    };
}]);


app.directive('variableinput', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            variable: '@',
            defaultvalue: '@',
            label: '@',
            additionalclass: '@'
        },
        templateUrl: 'templates/variableinput.html',
        link: function ($scope, element, attrs) {
            $scope.variablCleanName = $scope.variable.replace('.', '');
            $scope.variableLoaded = false;
            $scope.observer = null;
            
            senseApp.variable.getContent($scope.variable).then(function (model) {
                if (model) {
                    if (model.qContent && model.qContent.qIsNum) {
                        $scope.variableValue = Number(model.qContent.qString);
                    } else {
                        $scope.variableValue = model.qContent.qString;
                    }
                    $scope.variableLoaded = true;
                }
            });

            $scope.registerObserver = function (observer) {
                $scope.observer = observer;
            };

            $scope.updateValue = function (withValue) {
                $scope.variableValue = Number(withValue);
            };

            $scope.onChange = function () {
                if (!isNaN($scope.variableValue) && $scope.variableValue >= 0) {
                    senseApp.variable.setContent($scope.variable, new Number($scope.variableValue));
                    var valuescope = angular.element('#input-slider-' + $scope.variablCleanName).scope();
                    if (valuescope) {
                        valuescope.updateValue($scope.variableValue);
                    }
                    if ($scope.observer) {
                        $scope.observer.refresh();
                    }
                }
            };
        }
    };
});


app.directive('chartoptions', function ($rootScope, $timeout) {
    return {
        restrict: 'E',
        scope: {
            oid: '@',
            defaultvalue: '@',
            label: '@',
            additionalclass: '@'
        },
        templateUrl: 'templates/options.html',
        link: function ($scope, element, attrs) {
            $scope.show_panel = false;
            $scope.t = null;
            $scope.miliseconds = 5000;

            $scope.open = function () {
                $rootScope.openPopup($scope.oid);
                $scope.show_panel = false;
                
            };
            $scope.export = function () {
                $rootScope.exportDataForChart($scope.oid, element);
                $scope.show_panel = false;
            };
            $scope.toggle = function ($event) {
                if (!$scope.show_panel) {
                    $scope.t = $timeout(function () {
                        $scope.show_panel = false;
                    }, $scope.miliseconds );
                }
                $scope.show_panel = !$scope.show_panel;
                $event.stopPropagation();
            };
            $scope.mousemove = function () {
                $timeout.cancel($scope.t);
            };
            $scope.mouseout = function () {
                $scope.t = $timeout(function () {
                    $scope.show_panel = false;
                }, $scope.miliseconds );
            };
            $rootScope.$on('close-panels', function () {
                $scope.show_panel = false;
            });
        }
    };
});


app.directive('fieldselect', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            field: '@',
            defaultvalue: '@',
            label: '@',
            additionalclass: '@'
        },
        template: '<select ng-model="field_value" ng-options="val for val in field_values" ng-change="changed()"></select>',
        link: function ($scope, element, attrs) {
            $scope.observer = null;

            $scope.field_value = null;
            $scope.field_values = [];


            $scope.getFieldVal = function () {
                $scope.field_refs = senseApp.field($scope.field).getData({
                    rows: 4000
                });
                $scope.field_refs.OnData.bind(function (d) {
                    $scope.field_values = [];

                    var values = $scope.field_refs.rows;
                    for (var i = 0; i < values.length; ++i) {
                        $scope.field_values.push(values[i].qText);
                    }

                    if ($scope.defaultvalue === 'MAX' && !$scope.field_value) {
                        var max = Number($scope.field_values[0]);
                        for (var j = 0; j < $scope.field_values.length; ++j) {
                            if (max < Number($scope.field_values[j])) {
                                max = Number($scope.field_values[j]);
                            }
                        }
                        $scope.field_value = max.toString();
                        $scope.pickValue();
                    }

                });
            }



            $scope.pickValue = function () {
                senseApp.field($scope.field).clear()
                    .then(senseApp.field($scope.field).selectMatch($scope.field_value, true));
            };

            $scope.changed = function () {
                $scope.pickValue();
            };


            if ($rootScope.senseAppIsLoaded) {
                $scope.getFieldVal();
            } else {
                $rootScope.$on('senseapp-loaded', function () {
                    $scope.getFieldVal();
                });
            }
        }
    };
});



app.directive('vartoggle', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            variable: '@',
            values: '@',
            defaultvalue: '@',
            label: '@',
            additionalclass: '@'
        },
        template: '<span class="var-toggle-button" ng-repeat="val in var_values" ng-click="changed(val)" ng-class="{\'inactive-state\': variableValue == val.value}">{{val.name}}</span>',
        link: function ($scope, element, attrs) {
            $scope.variableLoaded = false;
            $scope.variableValue = null;
            $scope.var_values = [];

            if ($scope.values) {
                var vals = $scope.values.split('|');
                for (var i = 0; i < vals.length; ++i) {
                    var c = vals[i];
                    var name,value;

                    if (c.indexOf(',') > -1) {
                        var split = c.split(',');
                        name = split[0].replace("'", '').replace("'", '');
                        value = split[1].replace("'",'').replace("'", '');
                    }   else {
                        name = c; 
                        value = c;
                    }
                    $scope.var_values.push( {
                        name: name,
                        value: value
                    });
                }
            } 

            $scope.getVarVal = function () {
                senseApp.variable.getContent($scope.variable).then(function (model) {
                    if (model) {
                        if (model.qContent && model.qContent.qIsNum) {
                            $scope.variableValue = Number(model.qContent.qString);
                        } else {
                            $scope.variableValue = model.qContent.qString;
                        }
                        $scope.variableLoaded = true;
                    }
                });
            };


            $scope.changed = function (val) {
                $(element).addClass('var-toggle-loading');
                if (val.name) {
                    $scope.variableValue = val.value;
                } else {
                    $scope.variableValue = val;
                }
                
                senseApp.variable.setContent($scope.variable, $scope.variableValue).then(function() {
                    $(element).removeClass('var-toggle-loading');
                });
            };


            if ($rootScope.senseAppIsLoaded) {
                $scope.getVarVal();
            } else {
                $rootScope.$on('senseapp-loaded', function () {
                    $scope.getVarVal();
                });
            }


        }
    };
});

app.directive('fieldtoggle', function ($rootScope) {
    return {
        restrict: 'E',
        scope: {
            field: '@',
            defaultvalue: '@',
            label: '@',
            additionalclass: '@'
        },
        template: '<span ng-repeat="(val, val) in field_values">{{val}}</span>',
        link: function ($scope, element, attrs) {
            $scope.observer = null;

            $scope.field_value = null;
            $scope.field_values = [];

            $scope.getFieldVal = function () {
                $scope.field_refs = senseApp.field($scope.field).getData({
                    rows: 4000
                });
                $scope.field_refs.OnData.bind(function (d) {
                    $scope.field_values = [];

                    var values = $scope.field_refs.rows;
                    for (var i = 0; i < values.length; ++i) {
                        $scope.field_values.push(values[i].qText);
                    }

                    var hasValue = senseApp.field($scope.field).stateCounts.qSelected > 0;

                    if (!hasValue && $scope.defaultvalue === 'MAX' && !$scope.field_value) {
                        var max = Number($scope.field_values[0]);
                        for (var j = 0; j < $scope.field_values.length; ++j) {
                            if (max < Number($scope.field_values[j])) {
                                max = Number($scope.field_values[j]);
                            }
                        }
                        $scope.field_value = max.toString();
                    }

                });
            };

            $scope.changed = function () {
                senseApp.field($scope.field).clear()
                    .then(senseApp.field($scope.field).selectMatch($scope.field_value, true));
            };

            if ($rootScope.senseAppIsLoaded) {
                $scope.getFieldVal();
            } else {
                $rootScope.$on('senseapp-loaded', function () {
                    $scope.getFieldVal();
                });
            }

        }
    };
});