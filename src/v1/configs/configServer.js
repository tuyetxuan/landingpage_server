"use strict";
import {env} from "#libs/index.js";

env.config();

const development = {
	app: {
		port: process.env.SERVER_PORT || 5550,
		host: process.env.SERVER_HOST || "localhost",
	},
};

const production = {
	app: {
		port: process.env.SERVER_PORT || 5550,
		host: process.env.SERVER_HOST || "localhost",
	},
};

const config = {development, production};
const environment = process.env.NODE_ENV || "development";
console.log(
	`\n🚀 NODE_ENV RUNNING: ${environment}` +
	" ::: " +
	`PORT RUNNING: ${config[environment].app.port}` +
	" ::: " +
	`SERVER RUNNING: http://${config[environment].app.host}:${config[environment].app.port}`
);

export default config[environment];
