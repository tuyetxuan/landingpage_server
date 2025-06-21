"use strict";

import __RESPONSE__ from "#core/index.js";
import {getAllServices, getServiceByIdCategory} from "#services/ServiceService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __service__ = {
	getAllServices: async (req, res, next) => {
		const __ = await getAllServices(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: await getAllServices(req),
				request: req,
				lang: 'vi'
			}).send(res);
	},
	getServiceByIdCategory: async (req, res, next) => {
		const __ = await getServiceByIdCategory(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	}
};

export default __service__;
