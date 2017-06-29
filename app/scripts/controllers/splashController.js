'use strict';

app.controller('splashController', 
[
    '$rootScope',
    '$scope', 
    '$interval',
    '$filter',
    '$location',
    '$timeout',
    '$cookies',
    function (
        $rootScope,
        $scope,
        $interval,
        $filter,
        $location,
        $timeout,
        $cookies
    ) {
        $scope.MaxSplashNum = 6;
        $scope.splashNum = 1;
        $scope.isMobile = window.matchMedia("only screen and (max-width: 760px)");

        if ($scope.isMobile && $scope.isMobile.matches) {
            $scope.bkgImage = "../images/splash/" + $scope.splashNum + "_mobile.jpg";
        } else {
            $scope.bkgImage = "../images/splash/" + $scope.splashNum + ".jpg";
        }

        $scope.curVal = 1;
        $scope.maxVal = 100;
        $scope.i = null;
        $scope.skip = false;
        $scope.cached = {};
        $scope.loadingNext = false;

        $scope.init = function () {
            
            $scope.getImage(2);

            $rootScope.inSplash = false;            

            $scope.i = $interval(function () {
                $scope.curVal+=0.1;
                if ($scope.curVal >= $scope.maxVal) {
                    if (!$scope.loadingNext) {
                        $scope.nextSplash();
                    }
                }
            }, 15, 0);

            if ($cookies.get('straightToAnalysis')) {
                $rootScope.inSplash = false;
                $scope.slideDown(true);
            } else {
                $('#splashContainer').css('opacity', '1.0');
                $rootScope.inSplash = true;
            }
        };

        $scope.getImage = function(num) {
            if ($scope.cached.hasOwnProperty(num)) {
                return Promise.resolve();
            }

            if ($scope.isMobile && $scope.isMobile.matches) {
                return $.get('images/splash/' + num + '_mobile.jpg');
            }

            return $.get('images/splash/' + num + '.jpg');
        };

        $scope.checkClick = function () {
            $scope.skip = true;
            $timeout(function () {
                $scope.slideDown();
            }, 500);

             $cookies.put('straightToAnalysis', 'true');
            
        };

        $scope.nextSplash = function () {

            if (!$rootScope.inSplash) {
                return;
            }

            $scope.loadingNext = true;
            
            var next = (($scope.splashNum + 1) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 1);
            var next_follows = (($scope.splashNum + 2) > $scope.MaxSplashNum ? 1 :  $scope.splashNum + 2);

            $scope.getImage(next)
            .then(function () {
                    if (!$scope.cached.hasOwnProperty(next)) {
                        $scope.cached[next] = true;
                    }

                    $scope.curVal = 0;
                    $scope.loadingNext = false;
                    $("#index-cover-fader").animate({"opacity":"0.85"}, 1000, function () {
                        $scope.splashNum = next;                        
                        $("#index-cover-fader").animate({"opacity":"0.0"}, 600);
                    });
                    $scope.getImage(next_follows).then(function () {
                        $scope.cached[next_follows] = true;
                    });
            });
        };

        $rootScope.goToSection = function (section, with_slide, set_hidden) {
            var url_target = $filter('urlConverter')(section.title, $rootScope.defaultSection);
            $location.path(url_target);
            if (with_slide) {
                $scope.slideDown();
            }
            if (set_hidden) {
                $rootScope.show_responsive_menu = false;
            }
        };

        $scope.slideDown = function (straight) {
            var delayed = 1000;

            if (straight) {
                $interval.cancel($scope.i);
                $rootScope.inSplash = false;
                $(".contentwrap").css('opacity', "1.0");
                $(".splash").css('display', 'none');
                return;
            }

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


