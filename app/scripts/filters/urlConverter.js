"use strict";

app.filter('urlConverter', ['routeServices', function (routeServices) {
    return function (item, section) {
        var when = routeServices.routeConverterWhen(item, section);
        return when;
    };
}]);

app.filter('routeConverterWhen', ['routeServices', function (routeServices) {
    return function (item, section) {
        var when = routeServices.routeConverterWhen(item, section);
        return when;
    };
}]);
