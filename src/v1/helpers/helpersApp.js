import {debug} from "#libs/index.js";

function normalizePort(val) {
	var port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
}

function onError(error) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	
	var bind = typeof port === 'string'
		? 'Pipe ' + port
		: 'Port ' + port;
	
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
}

function onListening(server) {
	var addr = server.address();
	var bind = typeof addr === 'string'
		? 'pipe ' + addr
		: 'port ' + addr?.port || addr?.host;
	debug('Listening on ' + bind);
}

export {normalizePort, onError, onListening};
