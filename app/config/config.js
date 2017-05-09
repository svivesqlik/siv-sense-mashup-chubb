"use strict";

var current_environment = 'BETA';

var environments = {
    'LOCAL' : {
        host: window.location.host, 
        port: 443,
        protocol: window.location.protocol,
        prefix: '/',
        isSecure: (window.location.port == 443),
        appName: '1496d010-bebb-4ae4-89cc-69de7c53bb9b'
    }, 
    'LOCAL_PREFIX' : {
        host: "172.16.1.188",
        port: 443,
        protocol: 'https',
        prefix: '/sensefront/',
        isSecure: true,
        appName: 'ca592d58-9705-4768-ab6e-0226938bdb77',
        publishedappName: 'cb9990b0-2be7-4b1e-a6d9-dd19ab333049'
    }, 
    'BETA' : {
        host: "beta.qliksensestudios.com",
        port: 443,
        protocol: "https",
        prefix: '/',
        isSecure: true,
        appName: '85b99d80-d527-4164-b758-05d80694426c'
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


