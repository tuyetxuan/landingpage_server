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
		published_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		lock: {
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
		
	});
	
	Article.associate = (models) => {
		Article.belongsTo(models.User, {foreignKey: 'author_id', as: 'author', onDelete: 'SET NULL'});
		Article.belongsTo(models.ArticleCategory, {foreignKey: 'category_id', as: 'category', onDelete: 'SET NULL'});
	};
	
	return Article;
};
