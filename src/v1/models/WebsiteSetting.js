export default (sequelize, DataTypes) => {
	const WebsiteSetting = sequelize.define('WebsiteSetting', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		author_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		settings: {
			type: DataTypes.JSON,
			allowNull: false,
			validate: {
				isValidJson(value) {
					if (typeof value !== 'object') {
						throw new Error('Settings must be a valid JSON object');
					}
				},
			},
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
		tableName: 'website_settings',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	});
	
	WebsiteSetting.associate = (models) => {
		WebsiteSetting.belongsTo(models.User, {foreignKey: 'author_id', as: 'author', onDelete: 'SET NULL'});
	};
	
	return WebsiteSetting;
};
