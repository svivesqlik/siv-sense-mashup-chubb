"use strict";

var current_environment = 'LOCAL';

var environments = {
    'LOCAL_EXTENSION' : {
        host: window.location.host, 
        port: 443,
        protocol: window.location.protocol,
        prefix: '/',
        isSecure: (window.location.port == 443),
        appName: '1496d010-bebb-4ae4-89cc-69de7c53bb9b'
    }, 
    'LOCAL' : {
        host: "172.16.1.188",
        port: 443,
        protocol: 'https',
        prefix: '/chubb/',
        isSecure: true,
        //appName: '14bec530-1337-4974-99b8-22b2f622f6b2'
        'appName':'ddbf4c00-8c15-43c9-82e1-fafbfaef0689'
    }, 
    'BETA' : {
        host: "beta.qliksensestudios.com",
        port: 443,
        protocol: "https",
        prefix: '/',
        isSecure: true,
        //appName: 'd789cd85-7a47-440b-82cc-41242757e4a1'
        appName: '693b54d1-6a7c-4625-8885-cfae3a8aee36'//'5b81e213-0a5e-4ab9-bc4c-34161eebedf9'
    },
    'PROD' : {
        host: "srvsgsipro01.agbar.ga.local",
        port: 443,
        protocol: "https",
        prefix: '/',
        isSecure: true,
        appName: 'c1d1a701-99fd-4587-b132-e3b4a4566fa4'
    },

};




















//
// Load the connection depending on the environment
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


