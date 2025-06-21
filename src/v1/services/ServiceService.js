"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

const getAllServices = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 6;
		const keyword = req.query.keyword || '';
		const categoryId = parseInt(req.query.categoryId) || null;
		if (page < 1 || limit < 1) {
			throw new BAD_REQUEST({
				message: 'Page and limit must be greater than 0',
				request: req,
			});
		}
		
		const offset = (page - 1) * limit;
		const total = await db.Service.count({
			where: {is_active: true}
		})
		
		const services = await db.Service.findAll({
			where: {
				is_active: true,
				...((keyword && keyword.trim() !== '') ? {
					[db.Sequelize.Op.or]: [
						{name: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{description: {[db.Sequelize.Op.like]: `%${keyword}%`}},
					]
				} : {}),
				...(categoryId ? {category_id: categoryId} : {})
			},
			attributes: ['id', 'code', 'name', 'image_url', 'description', 'link_page', 'created_at', 'is_active'],
			include: [
				{
					model: db.ServiceCategory,
					as: 'category',
					attributes: ['id', 'name', 'thumbnail_url', 'description', 'created_at'],
					required: false
				},
				{
					model: db.User,
					as: 'author',
					attributes: ['first_name', 'last_name'],
					required: false
				}],
			order: [
				['name', 'ASC'],
			],
			limit: limit,
			offset: offset,
		});
		
		if (!services || services.length === 0) {
			if (page > 1) {
				const firstPageServices = await db.Service.findAll({
					where: {
						is_active: true,
						...((keyword && keyword.trim() !== '') ? {
							[db.Sequelize.Op.or]: [
								{name: {[db.Sequelize.Op.like]: `%${keyword}%`}},
								{description: {[db.Sequelize.Op.like]: `%${keyword}%`}},
							]
						} : {}),
						...(categoryId ? {category_id: categoryId} : {})
					},
					attributes: ['id', 'code', 'name', 'image_url', 'description', 'link_page', 'created_at', 'is_active'],
					include: [
						{
							model: db.ServiceCategory,
							as: 'category',
							attributes: ['id', 'name', 'thumbnail_url', 'description', 'created_at'],
							required: false
						},
						{
							model: db.User,
							as: 'author',
							attributes: ['first_name', 'last_name'],
							required: false
						}],
					order: [
						['name', 'ASC'],
					],
					limit: limit,
					offset: 0,
				});
				return {
					services: firstPageServices,
					total: total,
					totalPages: Math.ceil(total / limit),
					currentPage: 1,
				};
			}
			throw new NO_CONTENT({
				metadata: {
					services: [],
					total: 0,
					totalPages: 0,
					currentPage: page,
				},
				message: "No service found.",
				request: req,
			});
		}
		
		return {
			services: services,
			total: total,
			totalPages: Math.ceil(total / limit),
			currentPage: page,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
};

const getServiceByIdCategory = async (req) => {
	try {
		if (!req || typeof req !== 'object' || !req.params || !req.params.category_id) {
			throw new BAD_REQUEST({
				message: 'Invalid request object or missing service ID Category',
				request: req,
			});
		}
		const serviceIdCategory = req.params.category_id;
		const services = await db.Service.findAll({
			where: {
				category_id: serviceIdCategory,
				is_active: true
			},
			limit: 10,
			attributes: ['id', 'code', 'name', 'image_url', 'description', 'link_page', 'created_at', 'is_active'],
			include: [
				{
					model: db.ServiceCategory,
					as: 'category',
					attributes: ['id', 'name', 'thumbnail_url', 'description', 'created_at'],
					required: false
				},
				{
					model: db.User,
					as: 'author',
					attributes: ['first_name', 'last_name'],
					required: false
				}
			],
			order: [
				['created_at', 'DESC'],
			],
		});
		if (!services || services.length === 0) {
			throw new NO_CONTENT({
				metadata: {
					services: [],
					total: 0,
				},
				message: `Service with ID Category ${serviceIdCategory} not found.`,
				request: req,
			});
		}
		return {
			services: services,
			total: services.length,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
}

export {
	getAllServices,
	getServiceByIdCategory
};
