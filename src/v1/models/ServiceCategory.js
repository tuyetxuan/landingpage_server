export default (sequelize, DataTypes) => {
	const ServiceCategory = sequelize.define('ServiceCategory', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		thumbnail_url: {
			type: DataTypes.STRING(255),
			allowNull: false,
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
		tableName: 'service_categories',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['name']},
		],
	});
	
	ServiceCategory.associate = (models) => {
		ServiceCategory.hasMany(models.Service, {foreignKey: 'category_id', as: 'services'});
		ServiceCategory.hasMany(models.ContactSubmission, {foreignKey: 'service_category_id', as: 'contact_submissions'});
	};
	
	return ServiceCategory;
};
