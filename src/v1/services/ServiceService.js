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

const createService = async (req) => {
	try {
		// Validate request object
		if (!req || typeof req !== "object" || !req.body) {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
		// Check authentication data
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Invalid authentication data",
				suggestion: "Please check token and client_id",
			});
		}
		
		const authorId = req.keyStore.id;
		if (isNaN(authorId) || authorId <= 0) {
			throw new BAD_REQUEST({
				message: "Author ID must be a positive integer",
				request: req,
			});
		}
		
		const {category_id, code, name, description, link_page, is_active} = req.body;
		
		// Validate input
		if (!code || typeof code !== "string" || !/^[A-Z]{2,5}-[0-9]{3}$/.test(code)) {
			throw new BAD_REQUEST({
				message: "Code is missing or invalid. Must follow format: [A-Z]{2,5}-[0-9]{3} (e.g., ABC-123)",
				request: req,
			});
		}
		
		if (!name || typeof name !== "string" || name.trim() === "") {
			throw new BAD_REQUEST({
				message: "Name is missing or invalid",
				request: req,
			});
		}
		
		if (category_id !== undefined && category_id !== null) {
			if (isNaN(category_id) || Number(category_id) <= 0) {
				throw new BAD_REQUEST({
					message: "Category ID must be a positive integer",
					request: req,
				});
			}
		}
		
		if (description !== undefined && description !== null) {
			if (typeof description !== "string") {
				throw new BAD_REQUEST({
					message: "Description must be a string",
					request: req,
				});
			}
		}
		
		if (link_page !== undefined && link_page !== null) {
			if (typeof link_page !== "string" || !link_page.startsWith("http")) {
				throw new BAD_REQUEST({
					message: "link_page must be a valid URL starting with http",
					request: req,
				});
			}
		}
		
		if (is_active !== undefined && typeof is_active !== "boolean") {
			throw new BAD_REQUEST({
				message: "is_active must be a boolean value",
				request: req,
			});
		}
		
		// Check author role
		const author = await db.User.findByPk(authorId, {
			attributes: ["id", "role"],
		});
		if (!author || !["admin", "editor"].includes(author.role)) {
			throw new UNAUTHORIZED({
				message: "Only admins or editors can create services",
				request: req,
			});
		}
		
		// Check if code already exists
		const existingService = await db.Service.findOne({
			where: {code},
		});
		if (existingService) {
			throw new BAD_REQUEST({
				message: `Service with code ${code} already exists`,
				request: req,
			});
		}
		
		// Handle image upload
		let imageUrl = null;
		if (req.file) {
			const isImage = req.file.mimetype.startsWith("image/");
			const isLt5M = req.file.size / 1024 / 1024 < 5;
			if (!isImage || !isLt5M) {
				throw new BAD_REQUEST({
					message: "Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh có kích thước dưới 5MB.",
					request: req,
				});
			}
			
			const sanitizedName = removeVietnameseTones(name.trim()).toLowerCase().replace(/[^a-z0-9]+/g, '-');
			imageUrl = await new Promise((resolve, reject) => {
				cloudinaryConfig().uploader.upload_stream(
					{
						resource_type: "image",
						folder: `service_images/${sanitizedName}`,
						public_id: `${sanitizedName}_${Date.now()}_${authorId}`,
						overwrite: true,
					},
					(error, result) => {
						if (error) {
							return reject(
								new BAD_REQUEST({
									message: "Lỗi khi tải lên hình ảnh!",
									error,
								})
							);
						}
						resolve(result.secure_url);
					}
				).end(req.file.buffer);
			});
		} else if (req.body.image_url) {
			if (typeof req.body.image_url === "string" && req.body.image_url.startsWith("http")) {
				imageUrl = req.body.image_url;
			} else {
				throw new BAD_REQUEST({
					message:
						"Định dạng image_url không hợp lệ. Mong đợi một đối tượng File (thông qua multipart/form-data) hoặc một URL hợp lệ.",
					request: req,
				});
			}
		}
		
		// Create service
		const service = await db.Service.create({
			category_id: category_id || null,
			author_id: authorId,
			code,
			name,
			description: description || null,
			link_page: link_page || null,
			image_url: imageUrl,
			is_active: is_active !== undefined ? is_active : true,
		});
		
		if (!service) {
			throw new BAD_REQUEST({
				message: "Failed to create service",
				request: req,
			});
		}
		
		// Fetch created service
		const createdService = await db.Service.findByPk(service.id, {
			attributes: ["id", "category_id", "author_id", "code", "name", "description", "link_page", "image_url", "is_active", "created_at", "updated_at"],
		});
		
		return {
			service: createdService,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED) {
			throw error;
		}
		throw new BAD_REQUEST({
			message: `Failed to create service: ${error.message}`,
			request: req,
		});
	}
};

export {
	getAllServices,
	getServiceByIdCategory
};
