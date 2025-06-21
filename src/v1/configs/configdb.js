"use strict";
import {env} from "#libs/index.js";

env.config();


const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;
const DB_DIALECT = process.env.DB_DIALECT;
const DB_LOGGING = process.env.DB_LOGGING === false ? false : console.log;
const DB_POOL_MAX = parseInt(process.env.DB_POOL_MAX, 10) || 5;
const DB_POOL_MIN = parseInt(process.env.DB_POOL_MIN, 10) || 0;
const DB_POOL_IDLE = parseInt(process.env.DB_POOL_IDLE, 10) || 10000;
const DB_POOL_ACQUIRE = parseInt(process.env.DB_POOL_ACQUIRE, 10) || 60000;


export const development = {
	username: DB_USERNAME || "root",
	password: DB_PASSWORD || "",
	database: DB_NAME || "test",
	port: DB_PORT || "3366",
	host: DB_HOST || "localhost",
	dialect: DB_DIALECT || "mysql",
	logging: DB_LOGGING || false,
	pool: {
		max: DB_POOL_MAX || 5,
		min: DB_POOL_MIN || 0,
		idle: DB_POOL_IDLE || 10000,
		acquire: DB_POOL_ACQUIRE || 30000,
	}
};

export const test = {
	username: DB_USERNAME || "root",
	password: DB_PASSWORD || "",
	database: DB_NAME || "test",
	port: DB_PORT || "3366",
	host: DB_HOST || "localhost",
	dialect: DB_DIALECT || "mysql",
	logging: DB_LOGGING || false,
	pool: {
		max: DB_POOL_MAX || 5,
		min: DB_POOL_MIN || 0,
		idle: DB_POOL_IDLE || 10000,
		acquire: DB_POOL_ACQUIRE || 30000,
	}
};

export const production = {
	username: DB_USERNAME || "root",
	password: DB_PASSWORD || "",
	database: DB_NAME || "test",
	port: DB_PORT || "3366",
	host: DB_HOST || "localhost",
	dialect: DB_DIALECT || "mysql",
	logging: DB_LOGGING || false,
	pool: {
		max: DB_POOL_MAX || 5,
		min: DB_POOL_MIN || 0,
		idle: DB_POOL_IDLE || 10000,
		acquire: DB_POOL_ACQUIRE || 30000,
	}
};
