var fs = require('fs');
var _ = require('underscore');
var mime = require('mime');
var url = require('url');

var defaultHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers":  "Content-Type, Accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/html"
};

var sendResponse = function(response, data, statusCode, customHeader){
  statusCode = statusCode || 200;
  customHeader = customHeader || {};
  
  headers = _.extend({}, defaultHeaders, customHeader);
  response.writeHead(statusCode, headers);
  response.end(data);
}

var actions = {
  'GET': function(request, response){
    request.url = url.parse(request.url).pathname;
    if( request.url === '/'){ 
      request.url = '/index.html';
    }
    var path = __dirname + '/../client' + request.url;
    fs.readFile(path, function (error, file){
      if( error ){
        throw error;
      }
      var contentType = {
        'Content-Type': mime.lookup(path)
      }
      sendResponse(response, file, 200, contentType);
    });
    
  },
  'OPTIONS': function(request, response){
    sendResponse(response, null);
  }
};

var requestHandler = function(request, response) {
  var action = actions[request.method];
  action(request, response);
};

module.exports.requestHandler = requestHandler;
