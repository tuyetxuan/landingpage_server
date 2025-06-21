"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

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
			where: {clock: false, is_published: true}
		})
		
		const articles = await db.Article.findAll({
			where: {
				clock: false, is_published: true,
				...((keyword && keyword.trim() !== '') ? {
					[db.Sequelize.Op.or]: [
						{title: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{content: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{slug: {[db.Sequelize.Op.like]: `%${keyword}%`}},
						{published_at: {[db.Sequelize.Op.like]: `%${keyword}%`}},
					]
				} : {}),
				...(category_slug ? {'$category.slug$': category_slug} : {})
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
			offset: offset,
		});
		
		if (!articles || articles.length === 0) {
			if (page > 1) {
				const firstPageArticles = await db.Article.findAll({
					where: {
						clock: false, is_published: true,
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
				clock: false,
				is_published: true,
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


export {
	getAllArticles,
	getArticleById
};
