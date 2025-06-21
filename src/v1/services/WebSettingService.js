"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

const getWebSettings = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		const webSettings = await db.WebsiteSetting.findAll({
			attributes: ['id', 'settings', 'created_at'],
			include: [
				{
					model: db.User,
					as: 'author',
					attributes: ['id', 'first_name', 'last_name'],
					required: false
				}],
			order: [
				['created_at', 'ASC'],
			]
		});
		
		if (!webSettings || webSettings.length === 0) {
			throw new NO_CONTENT({
				metadata: {
					web_settings: [],
					total: 0,
				},
				message: "No Website Setting found.",
				request: req,
			});
		}
		
		return {
			web_settings: webSettings[0] || [],
			total: webSettings.length,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
};

export {
	getWebSettings,
};
