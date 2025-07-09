"use strict";

import __RESPONSE__ from "#core/index.js";
import {deleteContact, getAllContacts, submitContactService, updateAuthor, updateContact, updateStatus} from "#services/ContactService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __submitContact__ = {
	submitContactService: async (req, res) => {
		const __ = await submitContactService(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.CREATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	getAllContacts: async (req, res) => {
		const __ = await getAllContacts(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
					metadata: __,
					request: req,
					lang: 'vi'
				}
			).send(res);
	},
	updateContact: async (req, res) => {
		const __ = await updateContact(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
					metadata: __,
					request: req,
					lang: 'vi'
				}
			).send(res);
	},
	updateAuthor: async (req, res) => {
		const __ = await updateAuthor(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
					metadata: __,
					request: req,
					lang: 'vi'
				}
			).send(res);
	},
	updateStatus: async (req, res) => {
		const __ = await updateStatus(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
					metadata: __,
					request: req,
					lang: 'vi'
				}
			).send(res);
	},
	deleteContact: async (req, res) => {
		const __ = await deleteContact(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
					metadata: __,
					request: req,
					lang: 'vi'
				}
			).send(res);
	},
};

export default __submitContact__;
