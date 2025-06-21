"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

const getAllServiceCategories = async (req) => {
	try {
		
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		const serviceCategories = await db.ServiceCategory.findAll({
			include: [{
				model: db.Service,
				as: 'services',
				attributes: ['id', 'name', 'image_url', 'description', 'link_page', 'created_at'],
				required: true
			}],
			attributes: ['id', 'name', 'thumbnail_url', 'description', 'created_at'],
			order: [
				['name', 'ASC'],
				[{model: db.Service, as: 'services'}, 'name', 'ASC']
			]
		});
		
		if (!serviceCategories || serviceCategories.length === 0) {
			throw new NO_CONTENT({
				metadata: {
					service_categories: [],
					total: 0,
				},
				message: "No service categories found.",
				request: req,
			});
		}
		
		return {
			service_categories: serviceCategories,
			total: serviceCategories.length,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
};

export {
	getAllServiceCategories
};
