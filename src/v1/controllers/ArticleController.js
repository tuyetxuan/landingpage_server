"use strict";

import __RESPONSE__ from "#core/index.js";
import {createArticle, deleteArticle, getAllArticles, getAllArticlesForAdmin, getArticleById, updateArticle} from "#services/ArticleService.js";
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
	},
	getAllArticlesForAdmin: async (req, res, next) => {
		const __ = await getAllArticlesForAdmin(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	createArticle: async (req, res, next) => {
		const __ = await createArticle(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	updateArticle: async (req, res, next) => {
		const __ = await updateArticle(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	deleteArticle: async (req, res, next) => {
		const __ = await deleteArticle(req);
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
