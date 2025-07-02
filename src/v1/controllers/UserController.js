"use strict";

import __RESPONSE__ from "#core/index.js";
import {changePassword, createUser, getAllUsers, getUserById, logout, resetPassword, updateUser, updateUserRole, updateUserStatus} from "#services/UserService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __user__ = {
	getUserById: async (req, res, next) => {
		const __ = await getUserById(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: await getUserById(req),
				request: req,
				lang: 'vi'
			}).send(res);
	},
	updateUser: async (req, res, next) => {
		const __ = await updateUser(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.UPDATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	createUser: async (req, res, next) => {
		const __ = await createUser(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.CREATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	getAllUsers:
		async (req, res, next) => {
			const __ = await getAllUsers(req);
			if (__ instanceof SUCCESS_RESPONSE)
				return __.send(res);
			else
				new __RESPONSE__.FETCHED({
					metadata: __,
					request: req,
					lang: 'vi'
				}).send(res);
		}
	,
	updateUserRole: async (req, res, next) => {
		const __ = await updateUserRole(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.UPDATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	resetPassword: async (req, res, next) => {
		const __ = await resetPassword(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.UPDATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	updateUserStatus: async (req, res, next) => {
		const __ = await updateUserStatus(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.UPDATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	logOut: async (req, res, next) => {
		const __ = await logout(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.UPDATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	changePassword: async (req, res, next) => {
		const __ = await changePassword(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.UPDATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	}
};

export default __user__;
