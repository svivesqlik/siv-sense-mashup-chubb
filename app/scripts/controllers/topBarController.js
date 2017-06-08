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
        $scope.searchFields = [
            'Region',
            'Cluster',
            'Country',
            'MCC LOB',
            'Class',
            'Line',
            'Sector',
            'Year',
            'Period',
            'Qtr',
            'Broker Segmentation',
            'Broker Financial Entity',
            'Broker Field Office',
            'Producer',
            'Portfolio Class',
            'Risk Category',
            'Transaction Category',
            'Location of Risk',
            'Branch Name',
            'Quote ID',
            'Policy Number',
            'Insured Name Full',
            'Underwriter',
            'Quote Premium',
            'Prod Horizontal'
         ];

        $scope.show_responsive_menu = false;    
     
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

         $scope.openHelp = function () {
            $rootScope.filterPanelOpen = true;

            require(['introjs'], function (introJs) {
            var ijs = introJs()
                .setOption('showProgress', true)
                .onbeforechange(function(targetElement) {
                    
                    if ($(targetElement).attr('data-step') == '2') {
                        $rootScope.openFilters();
                    }

                     if ($(targetElement).attr('data-step') == '4') {
                         $rootScope.goToSection({title:'headlines'});
                     }

                })
                .onexit(function () {
                    //$('#mainContainer').css('opacity', 1.0);
                })
                .start();
            })
        };

        $scope.clickResult = function (field, value) {
            senseApp.field(field.key).selectValues([{
                'qText': value
            }], true, true).then(function () {
                $scope.searchTerm = '';
                $rootScope.processingOrFinished = false;
                $scope.searchResults = [];
                $rootScope.disableSearch();
            });
        };

        $scope.hideMenu = function () {
            $scope.show_responsive_menu = false;
        };

        $scope.hideResults = function () {
            $rootScope.processingOrFinished = false;
            $scope.searchTerm = '';
        };

        $scope.enableSearch = function () {
            $scope.searchFieldVisible = true;
            $('#container-cover').show();
        };

        $rootScope.disableSearch = function () {
            $('#container-cover').hide();
            $scope.searchFieldVisible = false;
            $rootScope.processingOrFinished = false;
        };
        
        $scope.selectionsGoBack = function () {
            $('.toolbar-icon.bck').css('opacity', 0.4);
            senseApp.back().then(function () {
                $('.toolbar-icon.bck').css('opacity', 1.0);
            });
        };

        $scope.selectionsGoForward = function () {
            $('.toolbar-icon.fwd').css('opacity', 0.4);
            senseApp.forward().then(function () {
                $('.toolbar-icon.fwd').css('opacity', 1.0);
            });
        };

        $scope.selectionsClear = function () {
            $('.toolbar-icon.clr').css('opacity', 0.4);
            senseApp.clearAll().then(function () {
                $('.toolbar-icon.clr').css('opacity', 1.0);
            });
        };

         $scope.search = function () {

                if ($scope.searchTerm === '') {
                    $rootScope.processingOrFinished = false;
                    $scope.searchResults = [];

                    return;
                }

                // The fields to search in the engine
               
                $scope.searching = true;
                $rootScope.processingOrFinished = true;

                senseApp.searchResults([$scope.searchTerm], {
                        qOffset: 0,
                        qCount: 15
                    }, {
                        qContext: 'CurrentSelections',
                        qSearchFields: $scope.searchFields
                    },
                    function (reply) {

                        $scope.searching = false;
                        console.log('search results', reply.qResult);

                        $scope.searchResults = [];
                        if (reply.qResult.qTotalNumberOfGroups === 0) {
                            //alert('No matches');
                        } else {
                            var str = "";
                            var results = [];
                            reply.qResult.qSearchGroupArray.forEach(function (value) {
                                value.qItems.forEach(function (item) {

                                    var searchMatches = [];

                                    item.qItemMatches.forEach(function (match) {
                                        searchMatches.push({
                                            text: match.qText
                                        });
                                    });
                                    if (item.qIdentifier)
                                        results.push({
                                            key: item.qIdentifier,
                                            matches: searchMatches
                                        });

                                });
                            });
                            $scope.searchResults = results;
                        }
                    });
            };

        $scope.init();

    }
]);





