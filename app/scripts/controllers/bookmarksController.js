'use strict';

app.controller('bookmarksController', [
    '$rootScope',
    '$scope',
    'bookmarksService',
    function (
        $rootScope,
        $scope,
        bookmarksService
    ) {

        $scope.bookmarkName = '';
        $scope.bookmarkDesc = '';

        $scope.saveBookmark = function (form) {
            bookmarksService.addBookmark(this.bookmarkName, this.bookmarkDesc).then(function () {
                $scope.bookmarkName = '';
                $scope.bookmarkDesc = '';
            });

        };

        $scope.removeBookmark = function (bookmark) {
            bookmarksService.removeBookmark(bookmark.id).then(function () {
                bookmarksService.loadBookmarks();
            });
        };

        $scope.activateBookmark = function (bookmark) {
            var modal_obj = $('#bookmarksModal');
            modal_obj.css('cursor', 'wait');

            bookmarksService.applyBookmark(bookmark.id).then(function () {
                modal_obj.modal('toggle');
            });

        };

    }
]);