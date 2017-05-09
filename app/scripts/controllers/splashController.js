'use strict';

app.controller('splashController', 
[
    '$scope', 
    '$interval',
    function (
        $scope,
        $interval
    ) {
        $scope.MaxSplashNum = 6;
        $scope.splashNum = 1;
        $scope.bkgImage = "../images/splash/" + $scope.splashNum + ".jpg";
        $scope.curVal = 1;
        $scope.maxVal = 100;
        $scope.i = null;

        $scope.init = function () {
            $scope.i = $interval(function () {
                $scope.curVal+=0.25;
                if ($scope.curVal >= $scope.maxVal) {
                    $scope.nextSplash();
                }
            }, 15, 0);

            //$scope.slideDown();
        };

        $scope.getImage = function(num) {
            return $.get('images/splash/' + num + '.jpg');
        };

        $scope.nextSplash = function () {
            $scope.curVal = 0;
            var next = (($scope.splashNum + 1) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 1);
            var next_follows = (($scope.splashNum + 2) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 2);

            $scope.getImage(next)
            .then(function () {                                
                    $scope.splashNum = next;
                    $scope.bkgImage = "../images/splash/" + $scope.splashNum + ".jpg";
                    $scope.getImage(next_follows);
            });
        };

        $scope.slideDown = function () {
            var delayed = 1000;
            $interval.cancel($scope.i);

            $(".splash").slideUp("800", function() {
                $(".contentwrap").delay(delayed * 2).animate({"opacity":"1.0"}, delayed * 1.5);
            });
        };

        $scope.init();

    }
]);


