"use strict";

import __RESPONSE__ from "#core/index.js";
import {getAllServiceCategories} from "#services/ServiceCategoryService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";


const __serviceCategory__ = {
	getAllServiceCategories: async (req, res, next) => {
		const __ = await getAllServiceCategories(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
};

export default __serviceCategory__;
