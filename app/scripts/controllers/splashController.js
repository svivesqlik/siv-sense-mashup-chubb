'use strict';

app.controller('splashController', 
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
        $scope.MaxSplashNum = 6;
        $scope.splashNum = 1;
        $scope.bkgImage = "../images/splash/" + $scope.splashNum + ".jpg";
        $scope.curVal = 1;
        $scope.maxVal = 100;
        $scope.i = null;
        $scope.skip = false;

        $scope.init = function () {
            $rootScope.inSplash = true;

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

        $scope.checkClick = function () {
            $scope.skip = true;
            $timeout(function () {
                $scope.slideDown();
            }, 500);
            
        };

        $scope.nextSplash = function () {

            if (!$rootScope.inSplash) {
                return;
            }

            $scope.curVal = 0;
            var next = (($scope.splashNum + 1) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 1);
            var next_follows = (($scope.splashNum + 2) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 2);

            $scope.getImage(next)
            .then(function () {                                
                    
                    $("#index-cover-fader").animate({"opacity":"0.85"}, 1000, function () {
                        $scope.splashNum = next;
                        $("#index-cover-fader").animate({"opacity":"0.0"}, 600);
                    });
                    $scope.getImage(next_follows);
            });
        };

        $rootScope.goToSection = function (section) {
            var url_target = $filter('urlConverter')(section.title, $rootScope.defaultSection);
            $location.path(url_target);
            $scope.slideDown();
        };

        $scope.slideDown = function () {
            var delayed = 1000;
            $interval.cancel($scope.i);
            $rootScope.inSplash = false;
            $(".contentwrap").css('opacity', "0");
            $(".splash").slideUp(delayed, function() {
                $(".contentwrap").animate({"opacity":"1.0"}, delayed / 2);
            });
        };

        $scope.init();

    }
]);


