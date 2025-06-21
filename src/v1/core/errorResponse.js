"use strict";

import geoip from "geoip-lite";
import {getMessage} from "#utils/messages.js";

/**
 * HTTP Error Status Codes
 * @type {Object<string, number>}
 */
const StatusCode = {
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	METHOD_NOT_ALLOWED: 405,
	CONFLICT: 409,
	REFRESH_TOKEN: 419,
	INTERNAL_SERVER_ERROR: 500,
	NOT_IMPLEMENTED: 501,
	BAD_GATEWAY: 502,
	SERVICE_UNAVAILABLE: 503,
};

/**
 * Reason phrases for HTTP Error Status Codes
 * @type {Object<string, string>}
 */
const ReasonStatusCode = {
	BAD_REQUEST: "BAD_REQUEST",
	UNAUTHORIZED: "UNAUTHORIZED",
	FORBIDDEN: "FORBIDDEN",
	NOT_FOUND: "NOT_FOUND",
	METHOD_NOT_ALLOWED: "METHOD_NOT_ALLOWED",
	CONFLICT: "CONFLICT",
	REFRESH_TOKEN: "REFRESH_TOKEN",
	INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
	NOT_IMPLEMENTED: "NOT_IMPLEMENTED",
	BAD_GATEWAY: "BAD_GATEWAY",
	SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
};

/**
 * Base Error Response class
 * @class
 * @extends Error
 */
class ErrorResponse extends Error {
	/**
	 * @param {Object} options
	 * @param {string} [options.message]
	 * @param {number} options.status
	 * @param {string} options.reason
	 * @param {string} [options.error_code]
	 * @param {string} [options.suggestion]
	 * @param {string} [options.redirectTo]
	 * @param {Object} [options.request]
	 * @param {string} [options.lang='en']
	 */
	constructor({
		            message,
		            status,
		            reason,
		            error_code,
		            suggestion,
		            redirectTo,
		            request,
		            lang = "en",
	            }) {
		const finalMessage = message || getMessage("error", reason, lang);
		super(finalMessage);
		this.status = status;
		this.reason = reason;
		this.message = finalMessage;
		this.error = true;
		this.error_code = error_code || reason;
		this.timestamp = new Date().toISOString();
		this.details = this._buildDetails(request, suggestion, redirectTo);
		
		console.log(`🛑 Sending ErrorResponse: status=${this.status}, message=${this.message}`);
	}
	
	/**
	 * Build request details
	 * @private
	 * @param {Object} [request]
	 * @param {string} [suggestion]
	 * @param {string} [redirectTo]
	 * @returns {Object}
	 */
	_buildDetails(request, suggestion, redirectTo) {
		if (!request) return {};
		
		const ip = request.ip || "none";
		return {
			requestedUrl: request.originalUrl || "none",
			suggestion: suggestion || "none",
			requestTime: request.requestTime || new Date().toISOString(),
			redirectTo: redirectTo || "none",
			browser: {
				userAgent: request.headers?.["user-agent"] || "none",
				ip,
				ipInfo: geoip.lookup(ip) || {},
				host: request.hostname || "none",
				origin: request.headers?.origin || "none",
				referer: request.headers?.referer || "none",
				location: request.headers?.location || "none",
				device: request.device?.type || "none",
				browser_details: {
					name: request.useragent?.browser || "none",
					version: request.useragent?.version || "none",
					os: request.useragent?.os || "none",
					platform: request.useragent?.platform || "none",
					source: request.useragent?.source || "none",
				},
			},
		};
	}
	
	/**
	 * Send error response
	 * @param {Object} res - Express response object
	 * @param {Object} [headers={}]
	 * @returns {Object}
	 */
	send(res, headers = {}) {
		return res.status(this.status).set(headers).json(this);
	}
	
	toJSON() {
		return {
			status: this.status,
			reason: this.reason,
			message: this.message,
			error: this.error,
			error_code: this.error_code,
			timestamp: this.timestamp,
			details: this.details,
		};
	}
}

/**
 * Factory function to create error response classes
 * @param {string} type
 * @param {number} statusCode
 * @param {string} reasonStatusCode
 * @returns {Function}
 */
const createErrorResponseClass = (type, statusCode, reasonStatusCode) => {
	return class extends ErrorResponse {
		constructor({message, suggestion, redirectTo, request, lang = "en"}) {
			super({
				message,
				status: statusCode,
				reason: reasonStatusCode,
				error_code: type,
				suggestion,
				redirectTo,
				request,
				lang,
			});
		}
	};
};

// Define and export error response classes
export const ERROR_RESPONSE = ErrorResponse;
export const BAD_REQUEST = createErrorResponseClass(ReasonStatusCode.BAD_REQUEST, StatusCode.BAD_REQUEST, ReasonStatusCode.BAD_REQUEST);
export const UNAUTHORIZED = createErrorResponseClass(ReasonStatusCode.UNAUTHORIZED, StatusCode.UNAUTHORIZED, ReasonStatusCode.UNAUTHORIZED);
export const FORBIDDEN = createErrorResponseClass(ReasonStatusCode.FORBIDDEN, StatusCode.FORBIDDEN, ReasonStatusCode.FORBIDDEN);
export const NOT_FOUND = createErrorResponseClass(ReasonStatusCode.NOT_FOUND, StatusCode.NOT_FOUND, ReasonStatusCode.NOT_FOUND);
export const METHOD_NOT_ALLOWED = createErrorResponseClass(ReasonStatusCode.METHOD_NOT_ALLOWED, StatusCode.METHOD_NOT_ALLOWED, ReasonStatusCode.METHOD_NOT_ALLOWED);
export const CONFLICT = createErrorResponseClass(ReasonStatusCode.CONFLICT, StatusCode.CONFLICT, ReasonStatusCode.CONFLICT);
export const REFRESH_TOKEN = createErrorResponseClass(ReasonStatusCode.REFRESH_TOKEN, StatusCode.REFRESH_TOKEN, ReasonStatusCode.REFRESH_TOKEN);
export const INTERNAL_SERVER_ERROR = createErrorResponseClass(ReasonStatusCode.INTERNAL_SERVER_ERROR, StatusCode.INTERNAL_SERVER_ERROR, ReasonStatusCode.INTERNAL_SERVER_ERROR);
export const NOT_IMPLEMENTED = createErrorResponseClass(ReasonStatusCode.NOT_IMPLEMENTED, StatusCode.NOT_IMPLEMENTED, ReasonStatusCode.NOT_IMPLEMENTED);
export const BAD_GATEWAY = createErrorResponseClass(ReasonStatusCode.BAD_GATEWAY, StatusCode.BAD_GATEWAY, ReasonStatusCode.BAD_GATEWAY);
export const SERVICE_UNAVAILABLE = createErrorResponseClass(ReasonStatusCode.SERVICE_UNAVAILABLE, StatusCode.SERVICE_UNAVAILABLE, ReasonStatusCode.SERVICE_UNAVAILABLE);
