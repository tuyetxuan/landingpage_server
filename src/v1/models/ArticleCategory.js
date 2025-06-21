export default (sequelize, DataTypes) => {
	const ArticleCategory = sequelize.define('ArticleCategory', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		slug: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
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
		tableName: 'article_categories',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['slug']},
		],
	});
	
	ArticleCategory.associate = (models) => {
		ArticleCategory.hasMany(models.Article, {foreignKey: 'category_id', as: 'articles'});
	};
	
	return ArticleCategory;
};
