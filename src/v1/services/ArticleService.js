"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";
import cloudinaryConfig from "#configs/cloudinary.js";
import {removeVietnameseTones} from "#utils/removeVietnameseTones.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED} = __RESPONSE__;

const uploadImageToCloudinary = async (req, folderName = "images") => {
	try {
		if (!req || typeof req !== "object" || !req.file) {
			throw new BAD_REQUEST({
				message: "Invalid request object or missing image file",
				request: req,
			});
		}
		const isImage = req.file.mimetype.startsWith("image/");
		const isLt5M = req.file.size / 1024 / 1024 < 5;
		if (!isImage || !isLt5M) {
			throw new BAD_REQUEST({
				message: "Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh có kích thước dưới 5MB.",
				request: req,
			});
		}
		const timestamp = Date.now();
		const sanitizedFolderName = removeVietnameseTones(folderName || "unknown").toLowerCase().replace(/[^a-z0-9]+/g, '-');
		const publicId = `${sanitizedFolderName}_${timestamp}`;
		const imageUrl = await new Promise((resolve, reject) => {
			cloudinaryConfig().uploader.upload_stream(
				{
					resource_type: "image",
					folder: `uploads/${sanitizedFolderName}`,
					public_id: publicId,
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
		
		return imageUrl;
		
	} catch (error) {
		if (error instanceof BAD_REQUEST) {
			throw error;
		}
		throw new BAD_REQUEST({
			message: `Failed to upload image: ${error.message}`,
			request: req,
		});
	}
};

const getAllArticles = async (req) => {
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
		const category_slug = req.query.category_slug || null;
		if (page < 1 || limit < 1) {
			throw new BAD_REQUEST({
				message: 'Page and limit must be greater than 0',
				request: req,
			});
		}
		
		const offset = (page - 1) * limit;
		const total = await db.Article.count({
			where: {
				lock: false,
				...((keyword && keyword.trim() !== '') ? {
					[db.Sequelize.Op.or]: [
						{title: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{content: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{slug: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{published_at: {[db.Sequelize.Op.like]: `%${keyword}%`}},
					]
				} : {}),
				...(category_slug ? {'$category.slug$': category_slug} : {}),
				published_at: {[db.Sequelize.Op.lt]: new Date()},
			},
			attributes: ['id', 'title', 'content', 'thumbnail_url', 'slug', 'published_at', 'created_at'],
			include: [
				{
					model: db.ArticleCategory,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
					required: false
				},
				{
					model: db.User,
					as: 'author',
					attributes: [
						[
							db.Sequelize.literal(`CASE WHEN author.role = 'admin' THEN 'manager' ELSE author.role END`),
							'position'
						],
						[
							db.Sequelize.literal(`CONCAT(author.first_name, ' ', author.last_name)`),
							'full_name'
						],
						['profile_image', 'avatar_url']
					],
					required: false
				}],
		})
		
		const articles = await db.Article.findAll({
			where: {
				lock: false,
				...((keyword && keyword.trim() !== '') ? {
					[db.Sequelize.Op.or]: [
						{title: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{content: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{slug: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{published_at: {[db.Sequelize.Op.like]: `%${keyword}%`}},
					]
				} : {}),
				...(category_slug ? {'$category.slug$': category_slug} : {}),
				published_at: {[db.Sequelize.Op.lt]: new Date()},
			},
			attributes: ['id', 'title', 'content', 'thumbnail_url', 'slug', 'published_at', 'created_at'],
			include: [
				{
					model: db.ArticleCategory,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
					required: false
				},
				{
					model: db.User,
					as: 'author',
					attributes: [
						[
							db.Sequelize.literal(`CASE WHEN author.role = 'admin' THEN 'manager' ELSE author.role END`),
							'position'
						],
						[
							db.Sequelize.literal(`CONCAT(author.first_name, ' ', author.last_name)`),
							'full_name'
						],
						['profile_image', 'avatar_url']
					],
					required: false
				}],
			order: [
				['published_at', 'DESC'],
			],
			limit: limit,
			offset: offset,
		});
		
		if (!articles || articles.length === 0) {
			if (page > 1) {
				const firstPageArticles = await db.Article.findAll({
					where: {
						lock: false,
						...((keyword && keyword.trim() !== '') ? {
							[db.Sequelize.Op.or]: [
								{title: {[db.Sequelize.Op.like]: `%${keyword}%`}},
								{content: {[db.Sequelize.Op.like]: `%${keyword}%`}},
								{slug: {[db.Sequelize.Op.like]: `%${keyword}%`}},
								{published_at: {[db.Sequelize.Op.like]: `%${keyword}%`}},
							]
						} : {}),
						...(categoryId ? {category_id: categoryId} : {})
					},
					attributes: ['id', 'title', 'content', 'thumbnail_url', 'slug', 'published_at'],
					include: [
						{
							model: db.ArticleCategory,
							as: 'category',
							attributes: ['id', 'name', 'slug'],
							required: false
						},
						{
							model: db.User,
							as: 'author',
							attributes: [
								[
									db.Sequelize.literal(`CASE WHEN author.role = 'admin' THEN 'manager' ELSE author.role END`),
									'position'
								],
								[
									db.Sequelize.literal(`CONCAT(author.first_name, ' ', author.last_name)`),
									'full_name'
								],
								['profile_image', 'avatar_url']
							],
							required: false
						}],
					order: [
						['published_at', 'DESC'],
					],
					limit: limit,
					offset: 0,
				});
				return {
					articles: firstPageArticles,
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
				message: "No article found.",
				request: req,
			});
		}
		
		return {
			articles: articles,
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

const getArticleById = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		const articleSlug = req.params.slug || '';
		const article = await db.Article.findOne({
			where: {
				slug: articleSlug,
				lock: false,
				published_at: {[db.Sequelize.Op.lt]: new Date()},
			},
			attributes: ['id', 'title', 'content', 'thumbnail_url', 'slug', 'published_at'],
			include: [
				{
					model: db.ArticleCategory,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
					required: false
				},
				{
					model: db.User,
					as: 'author',
					attributes: [
						[
							db.Sequelize.literal(`CASE WHEN author.role = 'admin' THEN 'manager' ELSE author.role END`),
							'position'
						],
						[
							db.Sequelize.literal(`CONCAT(author.first_name, ' ', author.last_name)`),
							'full_name'
						],
						['profile_image', 'avatar_url']
					],
					required: false
				}],
		});
		if (!article) {
			throw new NO_CONTENT({
				metadata: {
					service: []
				},
				message: `Article with Slug ${articleSlug} not found.`,
				request: req,
			});
		}
		return {
			article: article
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
}

const createArticle = async (req) => {
	try {
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
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
		
		const {title, content, category_id, published_at, lock} = req.body;
		
		// Validate input
		if (title === undefined || title === null) {
			throw new BAD_REQUEST({
				message: "Title is required",
				request: req,
			});
		}
		if (typeof title !== "string") {
			throw new BAD_REQUEST({
				message: "Title must be a string",
				request: req,
			});
		}
		if (title.trim() === "") {
			throw new BAD_REQUEST({
				message: "Title cannot be empty",
				request: req,
			});
		}
		
		if (content === undefined || content === null) {
			throw new BAD_REQUEST({
				message: "Content is required",
				request: req,
			});
		}
		if (typeof content !== "string") {
			throw new BAD_REQUEST({
				message: "Content must be a string",
				request: req,
			});
		}
		if (content.trim() === "") {
			throw new BAD_REQUEST({
				message: "Content cannot be empty",
				request: req,
			});
		}
		
		if (category_id !== undefined && category_id !== null) {
			if (isNaN(category_id)) {
				throw new BAD_REQUEST({
					message: "Category ID must be a number",
					request: req,
				});
			}
			if (Number(category_id) <= 0) {
				throw new BAD_REQUEST({
					message: "Category ID must be a positive integer",
					request: req,
				});
			}
		}
		
		let datePublished = null;
		if (published_at !== undefined && published_at !== null) {
			const [day, month, year] = published_at.split('/');
			datePublished = new Date(`${year}-${month}-${day}`);
			
			if (isNaN(datePublished.getTime())) {
				throw new BAD_REQUEST({
					message: "published_at must be a valid date in DD/MM/YYYY format",
					request: req,
				});
			}
		}
		
		if (lock !== undefined) {
			const lockBool = (typeof lock === "boolean") ? lock : (lock === "true" ? true : (lock === "false" ? false : null));
			if (lockBool === null) {
				throw new BAD_REQUEST({
					message: "lock must be a boolean value (true or false)",
					request: req,
				});
			}
		}
		
		const slugBase = removeVietnameseTones(title.trim()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		const existingArticle = await db.Article.findOne({
			where: {slug: slugBase},
		});
		const slug = existingArticle ? `${slugBase}-${Date.now()}` : slugBase;
		
		let thumbnailUrl = null;
		if (req.file) {
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
			const isImage = allowedTypes.includes(req.file.mimetype);
			const isLt5M = req.file.size / 1024 / 1024 < 5;
			if (!isImage || !isLt5M) {
				throw new BAD_REQUEST({
					message: 'Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh JPG, PNG, GIF, JPEG dưới 5MB.',
					request: req,
				});
			}
			
			thumbnailUrl = await new Promise((resolve, reject) => {
				cloudinaryConfig().uploader.upload_stream(
					{
						resource_type: "image",
						folder: `article_thumbnails/${slug}`,
						public_id: `${slug}_${Date.now()}_${authorId}`,
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
		} else if (req.body.thumbnail_url) {
			if (typeof req.body.thumbnail_url === "string" && req.body.thumbnail_url.startsWith("http")) {
				thumbnailUrl = req.body.thumbnail_url;
			} else {
				throw new BAD_REQUEST({
					message:
						"Định dạng thumbnail_url không hợp lệ. Mong đợi một đối tượng File (thông qua multipart/form-data) hoặc một URL hợp lệ.",
					request: req,
				});
			}
		}
		
		const article = await db.Article.create({
			title,
			content,
			slug,
			thumbnail_url: thumbnailUrl,
			author_id: authorId,
			category_id: category_id || null,
			published_at: datePublished,
			lock: lock !== undefined ? (typeof lock === "boolean" ? lock : (lock === "true" ? true : false)) : false,
		});
		
		if (!article) {
			throw new BAD_REQUEST({
				message: "Failed to create article",
				request: req,
			});
		}
		
		return {
			article: article,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED) {
			throw error;
		}
		throw error;
	}
};

const updateArticle = async (req) => {
	try {
		if (!req || typeof req !== "object") {
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
		
		const {article_id, title, content, category_id, lock, published_at} = req.body;
		
		// Validate article_id
		if (!article_id || isNaN(article_id) || article_id <= 0) {
			throw new BAD_REQUEST({
				message: "Article ID is missing or invalid",
				request: req,
			});
		}
		
		// Validate input
		if (title !== undefined && title !== null) {
			if (typeof title !== "string") {
				throw new BAD_REQUEST({
					message: "Title must be a string",
					request: req,
				});
			}
			if (title.trim() === "") {
				throw new BAD_REQUEST({
					message: "Title cannot be empty",
					request: req,
				});
			}
		}
		
		if (content !== undefined && content !== null) {
			if (typeof content !== "string") {
				throw new BAD_REQUEST({
					message: "Content must be a string",
					request: req,
				});
			}
			if (content.trim() === "") {
				throw new BAD_REQUEST({
					message: "Content cannot be empty",
					request: req,
				});
			}
		}
		
		if (category_id !== undefined && category_id !== null) {
			if (isNaN(category_id)) {
				throw new BAD_REQUEST({
					message: "Category ID must be a number",
					request: req,
				});
			}
			if (Number(category_id) <= 0) {
				throw new BAD_REQUEST({
					message: "Category ID must be a positive integer",
					request: req,
				});
			}
		}
		
		if (lock !== undefined) {
			const lockBool = (typeof lock === "boolean") ? lock : (lock === "true" ? true : (lock === "false" ? false : null));
			if (lockBool === null) {
				throw new BAD_REQUEST({
					message: "lock must be a boolean value (true or false)",
					request: req,
				});
			}
		}
		
		const article = await db.Article.findByPk(article_id, {
			attributes: ["id", "title", "content", "thumbnail_url", "slug", "author_id", "category_id", "published_at", "lock", "created_at"],
		});
		
		
		if (!article) {
			throw new BAD_REQUEST({
				message: `Article with ID ${article_id} not found`,
				request: req,
			});
		}
		
		// Prepare update data
		const updateData = {};
		if (title !== undefined) {
			updateData.title = title;
			const slugBase = removeVietnameseTones(title.trim()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
			const existingArticle = await db.Article.findOne({
				where: {slug: slugBase, id: {[db.Sequelize.Op.ne]: article_id}},
			});
			updateData.slug = existingArticle ? `${slugBase}-${Date.now()}` : slugBase;
		}
		if (content !== undefined) updateData.content = content;
		if (category_id !== undefined) updateData.category_id = category_id;
		if (published_at !== undefined && published_at !== null) {
			const [day, month, year] = published_at.split('/');
			const date = new Date(`${year}-${month}-${day}`);
			if (isNaN(date.getTime())) {
				throw new BAD_REQUEST({
					message: "published_at must be a valid date",
					request: req,
				});
			}
			updateData.published_at = date;
		}
		if (lock !== undefined) updateData.lock = (typeof lock === "boolean" ? lock : (lock === "true" ? true : false));
		
		// Handle thumbnail upload
		let thumbnailUrl = article.thumbnail_url;
		if (req.file) {
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
			const isImage = allowedTypes.includes(req.file.mimetype);
			const isLt5M = req.file.size / 1024 / 1024 < 5;
			if (!isImage || !isLt5M) {
				throw new BAD_REQUEST({
					message: 'Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh JPG, PNG, GIF, JPEG dưới 5MB.',
					request: req,
				});
			}
			
			thumbnailUrl = await new Promise((resolve, reject) => {
				cloudinaryConfig().uploader.upload_stream(
					{
						resource_type: "image",
						folder: `article_thumbnails/${updateData.slug || article.slug}`,
						public_id: `${updateData.slug || article.slug}_${Date.now()}_${authorId}`,
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
			updateData.thumbnail_url = thumbnailUrl;
		} else if (req.body.thumbnail_url) {
			if (typeof req.body.thumbnail_url === "string" && req.body.thumbnail_url.startsWith("http")) {
				thumbnailUrl = req.body.thumbnail_url;
				updateData.thumbnail_url = thumbnailUrl;
			} else {
				throw new BAD_REQUEST({
					message:
						"Định dạng thumbnail_url không hợp lệ. Mong đợi một đối tượng File (thông qua multipart/form-data) hoặc một URL hợp lệ.",
					request: req,
				});
			}
		}
		
		await article.update(updateData).catch(error => {
			throw new BAD_REQUEST({
				message: `Failed to update article with ID ${article_id}: ${error.message}`,
				request: req,
			});
		});
		
		return {
			article: article,
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw new BAD_REQUEST({
			message: `Failed to update article: ${error.message}`,
			request: req,
		});
	}
};

const deleteArticle = async (req) => {
	try {
		
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
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
		
		const {article_id} = req.params;
		
		if (!article_id || isNaN(article_id) || article_id <= 0) {
			throw new BAD_REQUEST({
				message: "Article ID is missing or invalid",
				request: req,
			});
		}
		
		// Find article
		const article = await db.Article.findByPk(article_id, {
			attributes: ["id"],
		});
		
		if (!article) {
			throw new BAD_REQUEST({
				message: `Article with ID ${article_id} not found`,
				request: req,
			});
		}
		
		await article.destroy().catch(error => {
			throw new BAD_REQUEST({
				message: `Failed to delete article with ID ${article_id}: ${error.message}`,
				request: req,
			});
		});
		
		return {
			article: article
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const getAllArticlesForAdmin = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		const articles = await db.Article.findAll({
			attributes: ['id', 'title', 'content', 'thumbnail_url', 'slug', 'published_at', 'created_at', 'lock'],
			include: [
				{
					model: db.ArticleCategory,
					as: 'category',
					attributes: ['id', 'name', 'slug'],
					required: false
				},
				{
					model: db.User,
					as: 'author',
					attributes: [
						[
							db.Sequelize.literal(`CASE WHEN author.role = 'admin' THEN 'manager' ELSE author.role END`),
							'position'
						],
						[
							db.Sequelize.literal(`CONCAT(author.first_name, ' ', author.last_name)`),
							'full_name'
						],
						['profile_image', 'avatar_url']
					],
					required: false
				}],
			order: [
				['created_at', 'DESC'],
			],
		});
		
		if (!articles || articles.length === 0) {
			return {
				articles: [],
				total: 0,
			};
		}
		
		return {
			articles: articles,
			total: articles.length,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
};

export {
	getAllArticles,
	getArticleById,
	createArticle,
	updateArticle,
	deleteArticle,
	getAllArticlesForAdmin,
};
