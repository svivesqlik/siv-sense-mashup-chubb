'use strict';

app.controller('sideBarController', 
[
    '$rootScope',
    '$scope', 
    '$interval',
    '$filter',
    '$location',
    '$timeout',
    function (
        $rootScope,
        $scope,
        $interval,
        $filter,
        $location,
        $timeout
    ) {
        $scope.selectionList = [];
        $scope.variable_holding_max_period = 'v_Max_Month';
        $scope.period_field_name = 'Period';
        
         $scope.registerListener = function () {
                // create an object
                var selState = senseApp.selectionState();

                var listener = function () {
                    $scope.getSelections();
                };

                //bind the listener
                selState.OnData.bind(listener);
            };
        

          $scope.removeFilter = function (field_name) {
                senseApp.field(field_name).clear().then(
                    function () {
                        $scope.getSelections();
                    });
            };

         $scope.getSelections = function () {

                $scope.selectionDescription = [
                    {
                        text:'You have not performed any selections'
                    } 
                ];

                if (senseApp.selectionState()) {
                    
                    var currentSelections = senseApp.selectionState().selections, iterator;
                    $scope.selectionList = [];
                    var vals = [];
                    var filter_desc = '';

                    $scope.filter_def = [];

                    for (iterator in currentSelections) {
                        var value = currentSelections[iterator];
                        var selectionObject = {};

                        if (value.fieldName !== 'Year') {
                                if (value.selectedCount > 1) {
                                    selectionObject = {
                                        field_name: value.fieldName,
                                        text: value.fieldName + ' : ' + value.selectedCount + ' of ' + value.totalCount
                                    };
                                } else {
                                    selectionObject = {
                                        field_name: value.fieldName,
                                        text: value.fieldName + ' : ' + value.qSelected
                                    };
                                }

                                $scope.selectionList.push(selectionObject);

                                filter_desc+=selectionObject.text + ' | ';

                                vals = [];
                                // Serialize the selections object
                                value.selectedValues.forEach(function (v) {
                                    vals.push(v.qName);
                                });
                                
                                vals.sort();

                                $scope.filter_def.push({
                                    field: value.fieldName,
                                    values: vals
                                });
                        }
                    }
                    $rootScope.selectionCount = $scope.selectionList.length;  
                    $rootScope.selectionDescription = $scope.selectionList;

                    if ($scope.selectionCount === 0) {
                        $scope.selectionDescription = [
                            {
                                text:'You have not performed any selections'
                            } 
                        ];
                    }
                }
            };

        $scope.selectPeriodToMax = function () {
            senseApp.variable.getContent($scope.variable_holding_max_period).then(function (model) {
                if (model) {
                    
                    if (model.qContent && model.qContent.qIsNum) {
                        var periodMax = Number(model.qContent.qString);
                        var periodValues = [];

                        for (var p = 1; p <= periodMax; ++p) {
                            periodValues.push(p);
                        }
                        
                        senseApp.field($scope.period_field_name).clear()
                            .then(function () {
                                senseApp.field($scope.period_field_name).selectValues(periodValues, true, true)
                                    .then(console.log('Selections performed: ', periodValues));
                            });
                    }

                    $scope.variableLoaded = true;
                }
            });
        };
         

        $rootScope.$on('senseapp-loaded', function () {
            $scope.registerListener(); 
            $scope.selectPeriodToMax();
        });

        if ($rootScope.senseAppIsLoaded) {
            $scope.registerListener(); 
            $scope.selectPeriodToMax();
        }

    }
]);





