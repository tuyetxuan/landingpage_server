"use strict";

import __RESPONSE__ from "#core/index.js";
import {getAllContacts, submitContactService} from "#services/ContactService.js";
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
	}
};

export default __submitContact__;
