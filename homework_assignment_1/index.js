/*
 * Init fil for API
 */

//import http from 'http';
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var fs = require('fs');

var config = require('./config');

// Crear instancia del server HTTP
var httpServer = http.createServer(function(request, response){
	unifiedServer(request, response);	
});

// Inicia el servidor HTTP
httpServer.listen(config.httpPort, function(){
	console.log("The server si listen on port " + config.httpPort + " en modo " +  config.envName);
});

// Server que responderá todas las peticiones http y https
var unifiedServer = function(request, response){
	// Obtener la URL y parsearla
	var parseUrl = url.parse(request.url, true);

	//Obtener la ruta
	var path = parseUrl.pathname;
	var trimmedPath = path.replace(/\/+|\/+$/g, '');

	//Obtener el query string como objeto
	var queryStringObject = parseUrl.query;

	// Obtener el método HTTP
	var method = request.method.toLowerCase();

	//Obtener los headers como objeto
	var headers = request.headers;

	// Obtener el payload, si existe
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	request.on('data', function(data){
		buffer += decoder.write(data);
	});
	request.on('end', function(){
		buffer += decoder.end();

		// Elegir el handler que debe responder para el request
		// En caso contrario, responde el handler notFOund
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construir el objeto data para enviar al handler
		var data = {
			'trimmedPath': trimmedPath,
			'queryStringObject': queryStringObject,
			'method': method,
			'payload': buffer,
		};

		chosenHandler(data, function(statusCode, payload){
			// Usar el status code llamado por el handler o default (200)
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			//Usar el payload llamado por el handler o el default (objeto vacio)
			payload = typeof(payload) == 'object' ? payload : {};

			var payloadString = JSON.stringify(payload);

			response.setHeader('Content-Type', 'application/json');
			response.writeHead(statusCode);
			response.end(payloadString);

			//Log la respuesta
			console.log('Regresando respuesta: ', statusCode, payloadString);
		});


	});
};

// Definir handlers
var handlers = {};

// Sample handler
handlers.hello = function(data, callback){
	var message = 'Please, send "name" param';
	var statusCode = 400;
	
	if(typeof(data.queryStringObject.name)== 'string'){
		message = 'Hello word my name is: '+data.queryStringObject.name;
		statusCode = 200;
	}

	callback(statusCode, {'message': message })
};

//Not found handler
handlers.notFound = function(data, callback){
	callback(404);
};

// Definir un request router
var router = {
	'hello': handlers.hello
};