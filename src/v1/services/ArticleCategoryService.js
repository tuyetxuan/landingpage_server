"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

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
						is_published: true,
						clock: false
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

export {
	getAllArticleCategories
};
