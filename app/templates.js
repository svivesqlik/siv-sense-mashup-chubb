angular.module('templates-main', ['../app/templates/404.html', '../app/templates/cp/destinations.html', '../app/templates/cp/finance.html', '../app/templates/cp/menu.html', '../app/templates/cp/purchases.html', '../app/templates/cp/purchases_PO.html', '../app/templates/crm/cotizaciones.html', '../app/templates/crm/customer-portal.html', '../app/templates/crm/dashboard.html', '../app/templates/crm/menu.html', '../app/templates/crm/visitas.html', '../app/templates/fiori/cotizaciones.html', '../app/templates/fiori/customer-portal.html', '../app/templates/fiori/dashboard.html', '../app/templates/fiori/visitas.html']);

angular.module("../app/templates/404.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/404.html",
    "Not found");
}]);

angular.module("../app/templates/cp/destinations.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/cp/destinations.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-md-2 block-50\" id=\"ZexyF\"></div>\n" +
    "    <div class=\"celsa-qs-chart col-md-2 block-50\" id=\"BtPCG\"></div>\n" +
    "</div>\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-6 col-md-6 col-sm-6 col-xs-12 block-500\" id=\"fbdFq\"></div>\n" +
    "    <div class=\"celsa-qs-chart col-lg-6 col-md-6 col-sm-6 col-xs-12 block-500 clearfix\" id=\"MmkSTXm\"></div> \n" +
    "</div>");
}]);

angular.module("../app/templates/cp/finance.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/cp/finance.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-1 block-50\" id=\"ZexyF\"></div>\n" +
    "    <div class=\"col-md-1 block-50\" id=\"BtPCG\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-5 col-sm-3 col-xs-12 block-450\" id=\"fbdFq\"></div>\n" +
    "    <div class=\"celsa-qs-chart col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-5 col-sm-3 col-xs-12 block-450 clearfix\" id=\"MmkSTXm\"></div> \n" +
    "</div>");
}]);

angular.module("../app/templates/cp/menu.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/cp/menu.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-lg-12\">\n" +
    "        <ul class=\"embed-list\">\n" +
    "            <li><a ui-sref-active=\"active\" ui-sref=\"customer-portal_purchases\">Purchases</a></li>\n" +
    "            <li><a ui-sref-active=\"active\" ui-sref=\"customer-portal_destinations\">Destinations</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../app/templates/cp/purchases.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/cp/purchases.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-md-2 block-50\" id=\"ZexyF\"></div>\n" +
    "    <div class=\"celsa-qs-chart col-md-2 block-50\" id=\"BtPCG\"></div>\n" +
    "</div>\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart with-bottom col-lg-6 col-md-6 col-sm-12 col-xs-12 block-350\" id=\"fRRApB\"></div>\n" +
    "    <div class=\"celsa-qs-chart with-bottom col-lg-6 col-md-6 col-sm-12 col-xs-12 block-350 clearfix\" id=\"mSjVw\"></div>\n" +
    "    <div class=\"celsa-qs-chart with-bottom col-lg-6 col-md-6 col-sm-12 col-xs-12 block-350\" id=\"SmUjU\"></div>\n" +
    "    <div class=\"celsa-qs-chart with-bottom col-lg-6 col-md-6 col-sm-12 col-xs-12 block-350 clearfix\" id=\"cWjMPJz\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/cp/purchases_PO.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/cp/purchases_PO.html",
    "<!-- Polish Example file, this will only be loaded if the language is set to polish only -->\n" +
    "<div class=\"celsa-qs-chart with-bottom col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-5 col-sm-3 col-xs-12 block-350\" id=\"fRRApB\"></div>\n" +
    "<div class=\"celsa-qs-chart with-bottom col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-5 col-sm-3 col-xs-12 block-350 clearfix\" id=\"mSjVw\"></div>\n" +
    "<div class=\"celsa-qs-chart with-bottom col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-5 col-sm-3 col-xs-12 block-350\" id=\"SmUjU\"></div>\n" +
    "<div class=\"celsa-qs-chart with-bottom col-lg-5 col-lg-offset-1 col-lg-offset-1 col-md-5 col-sm-3 col-xs-12 block-350 clearfix\" id=\"cWjMPJz\"></div>");
}]);

angular.module("../app/templates/crm/cotizaciones.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/crm/cotizaciones.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"VJFLWJ\"></div>\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"VJFLWJ\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/crm/customer-portal.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/crm/customer-portal.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"vXnpQS\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/crm/dashboard.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/crm/dashboard.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"vXnpQS\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/crm/menu.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/crm/menu.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-lg-12\">\n" +
    "        <ul class=\"embed-list\">\n" +
    "            <li><a ui-sref-active=\"active\" ui-sref=\"sap-crm_dashboard\">Dashboard</a></li>\n" +
    "            <li><a ui-sref-active=\"active\" ui-sref=\"sap-crm_cotizaciones\">Cotizaciones</a></li>\n" +
    "            <li><a ui-sref-active=\"active\" ui-sref=\"sap-crm_visitas\">Visitas</a></li>\n" +
    "            <li><a ui-sref-active=\"active\" ui-sref=\"sap-crm_customer-portal\">Customer Portal</a></li>\n" +
    "        </ul>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("../app/templates/crm/visitas.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/crm/visitas.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"YdDSvjk\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/fiori/cotizaciones.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/fiori/cotizaciones.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"vXnpQS\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/fiori/customer-portal.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/fiori/customer-portal.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"vXnpQS\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/fiori/dashboard.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/fiori/dashboard.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"vXnpQS\"></div>\n" +
    "</div>");
}]);

angular.module("../app/templates/fiori/visitas.html", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("../app/templates/fiori/visitas.html",
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"col-md-2 block-50\" id=\"AjDmdWf\"></div>\n" +
    "</div>\n" +
    "\n" +
    "\n" +
    "<div class=\"row col-lg-12\">\n" +
    "    <div class=\"celsa-qs-chart col-lg-12 block-450\" id=\"vXnpQS\"></div>\n" +
    "</div>");
}]);
