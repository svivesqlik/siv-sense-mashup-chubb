"use strict";

app.factory('bookmarksService', ['$rootScope', '$http', '$location', '$route',
    function ($rootScope, $http, $location, $route) {
        var _self = this;

        var _service = {
            loadBookmarks: function () {

                return senseApp.getList("BookmarkList", function (reply) {

                    $rootScope.bookmarks = [];
                    
                    $("#BookmarkList").empty();
                    $.each(reply.qBookmarkList.qItems, function (key, value) {
                        $rootScope.bookmarks .push({
                            id: value.qInfo.qId, 
                            name: value.qMeta.title,
                            description: value.qMeta.description
                        });
                    });

                });
            },
            addBookmark: function (bookmarkName, bookmarkDesc) {
                senseApp.bookmark.create(bookmarkName, bookmarkDesc);
            },
            removeBookMark: function (bookmark) {

                $rootScope.removeID = bookmark.key;

                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/remove-bookmark.html',
                    controller: 'ModalInstanceCtrl',
                    size: 'md',
                    windowClass: 'app-modal-window',
                    resolve: {
                        items: function () {
                            return $rootScope.removeID;
                        }
                    }
                });
            },
            showModal: function () {
                var _service = this;
                require(['bootstrapjs'], function () {
                        var modal_obj = $('#bookmarksModal');
                        _service.loadBookmarks().then(function () {
                            modal_obj.modal({});
                            modal_obj.on('shown.bs.modal', function () {
                        });
                    });
                });
            }
        };

        return _service;
    }
]);