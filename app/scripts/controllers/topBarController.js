'use strict';

app.controller('topBarController', 
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
     
        $scope.init = function () {
            $timeout(function () {
                $(".sidebar.right").sidebar({side: "right"}).trigger('sidebar:close');
                
            }, 2000);

        };

        $rootScope.triggerFilters = function () {
            $(".sidebar.right").trigger("sidebar:toggle");
        };

        $rootScope.openFilters = function () {
            $(".sidebar.right").trigger("sidebar:open");
        };

        $rootScope.closeFilters = function () {
            $(".sidebar.right").trigger("sidebar:close");
        };
        

        $scope.init();

    }
]);





