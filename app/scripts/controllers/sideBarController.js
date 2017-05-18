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

         $scope.registerListener = function () {
                // create an object
                var selState = senseApp.selectionState();

                var listener = function () {
                    $scope.getSelections();
                    //try {$scope.$apply();} catch (e) {}
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

            

        $rootScope.$on('senseapp-loaded', function () {
            $scope.registerListener(); 
        });

        if ($rootScope.senseAppIsLoaded) {
            $scope.registerListener(); 
        }


        $rootScope.closeFilters = function () {
            $(".sidebar.right").trigger("sidebar:close");
        };
        

    }
]);





