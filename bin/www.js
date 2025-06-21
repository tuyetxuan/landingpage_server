'use strict';
import {debug, env, http} from '#libs/index.js';
import configServer from '#configs/configServer.js';
import main from '#app/app.js';
import {normalizePort, onError, onListening} from '#helpers/helpersApp.js';

env.config();

const {
	app: {port, host},
} = configServer;

const debugLog = debug('landingpage_server:server');

var portApp = normalizePort(port || '3000');
var hostApp = host || 'localhost';
main.set('host', hostApp);
main.set('port', portApp);

var server = http.createServer(main);

server.listen(port, host, () => {
	debugLog(
		`\nNODE_ENV RUNNING: ${env.NODE_ENV}` +
		' ::: ' +
		`PORT RUNNING: ${port}` +
		' ::: ' +
		`SERVER RUNNING: http://${host}:${port}\n`
	);
});

server.on('error', onError);
server.on('listening', () => onListening(server));
