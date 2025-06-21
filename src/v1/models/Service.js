export default (sequelize, DataTypes) => {
	const Service = sequelize.define('Service', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		category_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		author_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		code: {
			type: DataTypes.STRING(255),
			allowNull: false,
			unique: true,
			validate: {
				is: /^[A-Z]{2,5}-[0-9]{3}$/,
			},
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
		},
		link_page: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		image_url: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
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
		tableName: 'services',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['code']},
			{
				name: 'idx_service_search',
				fields: ['name', 'description'],
				type: 'FULLTEXT',
			},
		],
	});
	
	Service.associate = (models) => {
		Service.belongsTo(models.ServiceCategory, {foreignKey: 'category_id', as: 'category', onDelete: 'SET NULL'});
		Service.belongsTo(models.User, {foreignKey: 'author_id', as: 'author', onDelete: 'SET NULL'});
	};
	
	return Service;
};
