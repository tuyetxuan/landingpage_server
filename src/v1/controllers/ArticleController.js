"use strict";

import __RESPONSE__ from "#core/index.js";
import {getAllArticles, getArticleById} from "#services/ArticleService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __article__ = {
	getAllArticles: async (req, res, next) => {
		const __ = await getAllArticles(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: await getAllArticles(req),
				request: req,
				lang: 'vi'
			}).send(res);
	},
	getArticleById: async (req, res, next) => {
		const __ = await getArticleById(req);
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

export default __article__;
