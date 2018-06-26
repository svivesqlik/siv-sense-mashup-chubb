// DO NOT DELETE THIS LINE BELOW
var current_environment, environments, chartDefaults;



current_environment = 'LOCAL_EXTENSION';

environments = {
    'LOCAL_EXTENSION' : {
        host: '172.16.1.188',
        port: 443,
        protocol: 'https',
        prefix: '/chubb/',
        isSecure: true,
        appName: '70e8f6b1-6193-4d0e-8838-5c49ba7276b0'
    },
    'LOCAL' : {
      host: "uk01pqsp001",
      port: 80,
      protocol: "http",
      prefix: '/prod/',
      isSecure: false,
      appName: '22836af1-2510-4088-a4e8-7a15138757bd'
    }
};

/*
* Defaults for the dropdown options in the charts
*/
chartDefaults = {
    // Options: "mode-geo","mode-broker","mode-class","mode-risk",
    'segmentation-page': 'mode-geo',

    // Options: 'mode-monthly', 'mode-cumulative'
    'headlines-page-chart': 'mode-monthly',
    // Options: "mode-view-plan","mode-view-forecast","mode-view-projection","mode-view-prior"
    'headlines-analytical-view':'mode-view-plan',

    // Options: 'mode-actual-absolute', 'mode-plan-absolute', 'mode-actual-vs-plan'
    'roll-forward': 'mode-actual-absolute'
};











































//
// DO NOT DELETE THIS CODE BELOW
//
var senseConnection, baseURL;
var basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
senseConnection = environments[current_environment];
senseConnection.getServerUrlWithPrefix = function () {
    return senseConnection.protocol + '://' + senseConnection.host + senseConnection.prefix;
};
senseConnection.getServerUrl = function (with_slash) {
    var _protocol = (senseConnection.isSecure ? "https://" : "http://");
    var _port = (senseConnection.port ? ":" + senseConnection.port : "");
    var _path = senseConnection.prefix;
    if (!with_slash && _path.substring(_path.length - 1) == '/') {
        _path = _path.substring(0, _path.length - 1);
    }
    return  _protocol + senseConnection.host + _port + _path;
};
senseConnection.requestStylesheet = function (server_asset) {
    var link,href,rel, remote_url;
    link = document.createElement( 'link' );
    href = document.createAttribute('href');
    rel = document.createAttribute('rel');
    href.value =  senseConnection.getServerUrlWithPrefix() +  server_asset;
    rel.value = 'stylesheet';
    link.setAttributeNode(href);
    link.setAttributeNode(rel);
    document.head.appendChild(link);

    return link;
};
senseConnection.requestScript = function (server_asset, data_main) {
  var script = document.createElement( 'script' );
  script.type = 'text/javascript';
  script.src = senseConnection.getServerUrlWithPrefix() + server_asset;
  if (data_main) {
    var main = document.createAttribute('data-main');
    main.value = data_main;
    script.setAttributeNode(main);
  }
  document.body.appendChild(script);

  return script;
};
senseConnection.requestAbsScript = function (server_asset) {
  var script = document.createElement( 'script' );
  script.type = 'text/javascript';
  script.src = server_asset;
  document.body.appendChild(script);

  return script;
};
senseConnection.requestAbsStylesheet = function (server_asset) {
    var link,href,rel, remote_url;
    link = document.createElement( 'link' );
    href = document.createAttribute('href');
    rel = document.createAttribute('rel');
    href.value = server_asset;
    rel.value = 'stylesheet';
    link.setAttributeNode(href);
    link.setAttributeNode(rel);
    document.head.appendChild(link);

    return link;
};
if (!senseConnection && window.console) {
    if (window.console) console.error('Environment in config does not exist or is incorrect.');
}
// Create the base url for requirejs
var _protocol = (senseConnection.isSecure ? "https://" : "http://");
var _port = (senseConnection.port ? ":" + senseConnection.port : "");
var _path = senseConnection.prefix + "resources";
baseURL =  _protocol + senseConnection.host + _port + _path;
