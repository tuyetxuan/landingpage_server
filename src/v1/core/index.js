"use strict";

import * as successResponse from "./successResponse.js";
import * as errorResponse from "./errorResponse.js";

export default {
	// Từ successResponse.js
	OK: successResponse.OK,
	CREATED: successResponse.CREATED,
	ACCEPTED: successResponse.ACCEPTED,
	NO_CONTENT: successResponse.NO_CONTENT,
	RESET_CONTENT: successResponse.RESET_CONTENT,
	UPDATED: successResponse.UPDATED,
	DELETED: successResponse.DELETED,
	FETCHED: successResponse.FETCHED,
	// Từ errorResponse.js
	BAD_REQUEST: errorResponse.BAD_REQUEST,
	UNAUTHORIZED: errorResponse.UNAUTHORIZED,
	NOT_FOUND: errorResponse.NOT_FOUND,
	FORBIDDEN: errorResponse.FORBIDDEN,
	NotFound: errorResponse.BAD_REQUEST,
	MethodNotAllowed: errorResponse.BAD_REQUEST,
	Conflict: errorResponse.BAD_REQUEST,
	REFRESH_TOKEN: errorResponse.REFRESH_TOKEN,
	InternalServer: errorResponse.BAD_REQUEST,
	NotImplemented: errorResponse.BAD_REQUEST,
	BadGateway: errorResponse.BAD_REQUEST,
	ServiceUnavailable: errorResponse.BAD_REQUEST
};

export const OK = successResponse.OK
export const CREATED = successResponse.CREATED
export const ACCEPTED = successResponse.ACCEPTED
export const NO_CONTENT = successResponse.NO_CONTENT
export const RESET_CONTENT = successResponse.RESET_CONTENT
export const UPDATED = successResponse.UPDATED
export const DELETED = successResponse.DELETED
export const FETCHED = successResponse.FETCHED
export const BAD_REQUEST = errorResponse.BAD_REQUEST
export const UNAUTHORIZED = errorResponse.UNAUTHORIZED
export const FORBIDDEN = errorResponse.FORBIDDEN
export const NOT_FOUND = errorResponse.NOT_FOUND
export const METHOD_NOT_ALLOWED = errorResponse.METHOD_NOT_ALLOWED
export const CONFLICT = errorResponse.CONFLICT
export const REFRESH_TOKEN = errorResponse.REFRESH_TOKEN
export const INTERNAL_SERVER_ERROR = errorResponse.INTERNAL_SERVER_ERROR
export const NOT_IMPLEMENTED = errorResponse.NOT_IMPLEMENTED
export const BAD_GATEWAY = errorResponse.BAD_GATEWAY
export const SERVICE_UNAVAILABLE = errorResponse.SERVICE_UNAVAILABLE
