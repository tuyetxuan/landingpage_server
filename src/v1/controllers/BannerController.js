"use strict";

import __RESPONSE__ from "#core/index.js";
import {createBanner, deleteBanner, getAll, getAllBanners, updateBanner} from "#services/BannerService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __banner__ = {
	createBanner: async (req, res, next) => {
		const __ = await createBanner(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	getAllBanners: async (req, res, next) => {
		const __ = await getAllBanners(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	updateBanner: async (req, res, next) => {
		const __ = await updateBanner(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	deleteBanner: async (req, res, next) => {
		const __ = await deleteBanner(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
	getAll: async (req, res, next) => {
		const __ = await getAll(req);
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

export default __banner__;
