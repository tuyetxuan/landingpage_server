"use strict";

import geoip from "geoip-lite";
import {getMessage} from "#utils/messages.js";

/**
 * HTTP Status Codes
 * @type {Object<string, number>}
 */
const StatusCode = {
	OK: 200,
	CREATED: 201,
	ACCEPTED: 202,
	NO_CONTENT: 204,
	RESET_CONTENT: 205,
	UPDATED: 200,
	DELETED: 200,
	FETCHED: 200,
};

/**
 * Reason phrases for HTTP Status Codes
 * @type {Object<string, string>}
 */
const ReasonStatusCode = {
	OK: "OK",
	CREATED: "CREATED",
	ACCEPTED: "ACCEPTED",
	NO_CONTENT: "NO_CONTENT",
	RESET_CONTENT: "RESET_CONTENT",
	UPDATED: "UPDATED",
	DELETED: "DELETED",
	FETCHED: "FETCHED",
};

/**
 * Base Success Response class
 * @class
 */
class SuccessResponse {
	/**
	 * @param {Object} options
	 * @param {number} [options.statusCode=StatusCode.OK]
	 * @param {string} [options.reasonStatusCode=ReasonStatusCode.OK]
	 * @param {string} [options.message]
	 * @param {Object} [options.metadata]
	 * @param {string} [options.suggestion]
	 * @param {string} [options.redirectTo]
	 * @param {Object} [options.request]
	 * @param {string} [options.lang='en']
	 */
	constructor({
		            statusCode = StatusCode.OK,
		            reasonStatusCode = ReasonStatusCode.OK,
		            message,
		            metadata = {},
		            suggestion,
		            redirectTo,
		            request,
		            lang = "en",
	            }) {
		this.status = statusCode;
		this.reason = reasonStatusCode;
		this.message = message || getMessage("success", reasonStatusCode, lang);
		this.success_code = message ? "CUSTOM" : reasonStatusCode;
		this.metadata = metadata;
		this.success = true;
		this.responseTime = new Date().toISOString();
		this.details = this._buildDetails(request, suggestion, redirectTo);
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
	 * Send response
	 * @param {Object} res - Express response object
	 * @param {Object} [headers={}]
	 * @returns {Object}
	 */
	send(res, headers = {}) {
		if (this.status === StatusCode.NO_CONTENT) {
			return res.status(200).set(headers).json(this);
		}
		return res.status(this.status).set(headers).json(this);
	}
}

/**
 * Factory function to create response classes
 * @param {string} type
 * @param {number} statusCode
 * @param {string} reasonStatusCode
 * @returns {Function}
 */
const createResponseClass = (type, statusCode, reasonStatusCode) => {
	return class extends SuccessResponse {
		constructor({message, metadata, suggestion, redirectTo, request, lang = "en"}) {
			super({
				statusCode,
				reasonStatusCode,
				message,
				metadata,
				suggestion,
				redirectTo,
				request,
				lang,
			});
		}
	};
};

// Define and export response classes
export const SUCCESS_RESPONSE = SuccessResponse;
export const OK = createResponseClass(ReasonStatusCode.OK, StatusCode.OK, ReasonStatusCode.OK);
export const CREATED = createResponseClass(ReasonStatusCode.CREATED, StatusCode.CREATED, ReasonStatusCode.CREATED);
export const ACCEPTED = createResponseClass(ReasonStatusCode.ACCEPTED, StatusCode.ACCEPTED, ReasonStatusCode.ACCEPTED);
export const NO_CONTENT = createResponseClass(ReasonStatusCode.NO_CONTENT, StatusCode.NO_CONTENT, ReasonStatusCode.NO_CONTENT);
export const RESET_CONTENT = createResponseClass(ReasonStatusCode.RESET_CONTENT, StatusCode.RESET_CONTENT, ReasonStatusCode.RESET_CONTENT);
export const UPDATED = createResponseClass(ReasonStatusCode.UPDATED, StatusCode.UPDATED, ReasonStatusCode.UPDATED);
export const DELETED = createResponseClass(ReasonStatusCode.DELETED, StatusCode.DELETED, ReasonStatusCode.DELETED);
export const FETCHED = createResponseClass(ReasonStatusCode.FETCHED, StatusCode.FETCHED, ReasonStatusCode.FETCHED);
