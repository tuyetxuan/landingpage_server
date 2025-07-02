"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";
import {removeVietnameseTones} from "#utils/removeVietnameseTones.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

const getAllArticleCategories = async (req) => {
	try {
		
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		const articleCategories = await db.ArticleCategory.findAll({
			attributes: [
				'id',
				'name',
				'slug',
				'description',
				'created_at',
				[
					db.Sequelize.fn('COALESCE',
						db.Sequelize.fn('COUNT', db.Sequelize.col('articles.id')),
						0
					),
					'news_count'
				]
			],
			include: [
				{
					model: db.Article,
					attributes: [],
					as: 'articles',
					required: false,
					where: {
						lock: false,
						published_at: {[db.Sequelize.Op.lt]: new Date()},
					}
				}
			],
			group: ['ArticleCategory.id', 'ArticleCategory.name', 'ArticleCategory.slug', 'ArticleCategory.description', 'ArticleCategory.created_at'],
			order: [['created_at', 'DESC']],
			raw: true
		});
		
		if (!articleCategories || articleCategories.length === 0) {
			throw new NO_CONTENT({
				metadata: {
					article_categories: [],
					total: 0,
				},
				message: "No article categories found.",
				request: req,
			});
		}
		
		return {
			article_categories: articleCategories,
			total: articleCategories.length,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
};

const createArticleCategory = async (req) => {
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
		
		const {name, description} = req.body;
		
		// Validate input
		if (name === undefined || name === null) {
			throw new BAD_REQUEST({
				message: "Name is required",
				request: req,
			});
		}
		if (typeof name !== "string") {
			throw new BAD_REQUEST({
				message: "Name must be a string",
				request: req,
			});
		}
		if (name.trim() === "") {
			throw new BAD_REQUEST({
				message: "Name cannot be empty",
				request: req,
			});
		}
		
		if (description !== undefined && description !== null) {
			if (typeof description !== "string") {
				throw new BAD_REQUEST({
					message: "Description must be a string",
					request: req,
				});
			}
		}
		
		// Check author role
		const author = await db.User.findByPk(authorId, {
			attributes: ["id", "role"],
		});
		if (!author || !["admin", "editor"].includes(author.role)) {
			throw new UNAUTHORIZED({
				message: "Only admins or editors can create article categories",
				request: req,
			});
		}
		
		// Generate slug from name
		const slugBase = removeVietnameseTones(name.trim()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
		const existingCategory = await db.ArticleCategory.findOne({
			where: {slug: slugBase},
		});
		const slug = existingCategory ? `${slugBase}-${Date.now()}` : slugBase;
		
		// Create article category
		const category = await db.ArticleCategory.create({
			name,
			slug,
			description: description || null,
		});
		
		if (!category) {
			throw new BAD_REQUEST({
				message: "Failed to create article category",
				request: req,
			});
		}
		
		// Fetch created category
		const createdCategory = await db.ArticleCategory.findByPk(category.id, {
			attributes: ["id", "name", "slug", "description", "created_at", "updated_at"],
		});
		
		return {
			category: createdCategory,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED) {
			throw error;
		}
		throw new BAD_REQUEST({
			message: `Failed to create article category: ${error.message}`,
			request: req,
		});
	}
};

const updateArticleCategory = async (req) => {
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
		
		const {category_id, name, description} = req.body;
		
		// Validate category_id
		if (!category_id || isNaN(category_id) || category_id <= 0) {
			throw new BAD_REQUEST({
				message: "Category ID is missing or invalid",
				request: req,
			});
		}
		
		// Validate input
		if (name !== undefined && name !== null) {
			if (typeof name !== "string") {
				throw new BAD_REQUEST({
					message: "Name must be a string",
					request: req,
				});
			}
			if (name.trim() === "") {
				throw new BAD_REQUEST({
					message: "Name cannot be empty",
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
		
		// Check author role
		const author = await db.User.findByPk(authorId, {
			attributes: ["id", "role"],
		});
		if (!author || !["admin", "editor"].includes(author.role)) {
			throw new UNAUTHORIZED({
				message: "Only admins or editors can update article categories",
				request: req,
			});
		}
		
		// Find category
		const category = await db.ArticleCategory.findByPk(category_id, {
			attributes: ["id", "name", "slug", "description", "created_at", "updated_at"],
		});
		
		if (!category) {
			throw new NOT_FOUND({
				message: `Article category with ID ${category_id} not found`,
				request: req,
			});
		}
		
		// Prepare update data
		const updateData = {};
		if (name !== undefined) {
			updateData.name = name;
			const slugBase = removeVietnameseTones(name.trim()).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
			const existingCategory = await db.ArticleCategory.findOne({
				where: {slug: slugBase, id: {[db.Sequelize.Op.ne]: category_id}},
			});
			updateData.slug = existingCategory ? `${slugBase}-${Date.now()}` : slugBase;
		}
		if (description !== undefined) updateData.description = description;
		
		// Update category
		await category.update(updateData).catch(error => {
			throw new BAD_REQUEST({
				message: `Failed to update article category with ID ${category_id}: ${error.message}`,
				request: req,
			});
		});
		
		return {
			category: category,
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw new BAD_REQUEST({
			message: `Failed to update article category: ${error.message}`,
			request: req,
		});
	}
};

const deleteArticleCategory = async (req) => {
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
		
		const {category_id} = req.body;
		
		// Validate category_id
		if (!category_id || isNaN(category_id) || category_id <= 0) {
			throw new BAD_REQUEST({
				message: "Category ID is missing or invalid",
				request: req,
			});
		}
		
		// Check author role
		const author = await db.User.findByPk(authorId, {
			attributes: ["id", "role"],
		});
		if (!author || !["admin", "editor"].includes(author.role)) {
			throw new UNAUTHORIZED({
				message: "Only admins or editors can delete article categories",
				request: req,
			});
		}
		
		// Find category
		const category = await db.ArticleCategory.findByPk(category_id, {
			attributes: ["id"],
		});
		
		if (!category) {
			throw new NOT_FOUND({
				message: `Article kategori dengan ID ${category_id} tidak ditemukan`,
				request: req,
			});
		}
		
		// Check for related articles
		const relatedArticles = await db.Article.count({
			where: {category_id: category_id},
		});
		if (relatedArticles > 0) {
			throw new BAD_REQUEST({
				message: `Tidak dapat menghapus kategori dengan ID ${category_id} karena masih ada ${relatedArticles} artikel terkait`,
				request: req,
			});
		}
		
		// Delete category
		await category.destroy().catch(error => {
			if (error.name === 'SequelizeForeignKeyConstraintError') {
				throw new BAD_REQUEST({
					message: `Tidak dapat menghapus kategori dengan ID ${category_id} karena masih ada bài viết liên quan`,
					request: req,
				});
			}
			throw new BAD_REQUEST({
				message: `Gagal menghapus kategori artikel dengan ID ${category_id}: ${error.message}`,
				request: req,
			});
		});
		
		return {
			message: `Kategori artikel dengan ID ${category_id} berhasil dihapus`,
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw new BAD_REQUEST({
			message: `Gagal menghapus kategori artikel: ${error.message}`,
			request: req,
		});
	}
};

const getAllArticleCategoriesForAdmin = async (req) => {
	try {
		
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		const articleCategories = await db.ArticleCategory.findAll({
			attributes: [
				'id',
				'name',
				'slug',
				'description',
				'created_at',
			],
			order: [['created_at', 'DESC']],
		});
		
		if (!articleCategories || articleCategories.length === 0) {
			return {
				article_categories: [],
				total: 0,
			};
		}
		
		return {
			article_categories: articleCategories,
			total: articleCategories.length,
		};
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
};

export {
	getAllArticleCategories,
	createArticleCategory,
	updateArticleCategory,
	deleteArticleCategory,
	getAllArticleCategoriesForAdmin
};
