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
                        $rootScope.bookmarks.push({
                            id: value.qInfo.qId, 
                            name: value.qMeta.title,
                            description: value.qMeta.description
                        });
                    });

                });
            },
            addBookmark: function (bookmarkName, bookmarkDesc) {
                return senseApp.bookmark.create(bookmarkName, bookmarkDesc);
            },
            removeBookmark: function (id) {
                return senseApp.bookmark.remove(id);
            },
            applyBookmark: function (id) {
                return senseApp.bookmark.apply(id);
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