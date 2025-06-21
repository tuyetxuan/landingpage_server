"use strict";

import __RESPONSE__ from "#core/index.js";
import {getAllArticleCategories} from "#services/ArticleCategoryService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";


const __articleCategory__ = {
	getAllArticleCategories: async (req, res, next) => {
		const __ = await getAllArticleCategories(req);
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

export default __articleCategory__;
