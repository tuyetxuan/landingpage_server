export default (sequelize, DataTypes) => {
	const Article = sequelize.define('Article', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		thumbnail_url: {
			type: DataTypes.STRING(255),
		},
		slug: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		author_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		category_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		is_published: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		published_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		clock: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			onUpdate: DataTypes.NOW,
		},
	}, {
		tableName: 'articles',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['slug']},
			{fields: ['published_at']},
			{fields: ['category_id']},
			{
				name: 'idx_article_search',
				fields: ['title', 'content'],
				type: 'FULLTEXT',
			},
		],
		validate: {
			validPublication() {
				if (this.is_published && !this.published_at) {
					throw new Error('Published articles must have a published_at date');
				}
				if (!this.is_published && this.published_at) {
					throw new Error('Non-published articles cannot have a published_at date');
				}
			}
		},
	});
	
	Article.associate = (models) => {
		Article.belongsTo(models.User, {foreignKey: 'author_id', as: 'author', onDelete: 'SET NULL'});
		Article.belongsTo(models.ArticleCategory, {foreignKey: 'category_id', as: 'category', onDelete: 'SET NULL'});
	};
	
	return Article;
};
