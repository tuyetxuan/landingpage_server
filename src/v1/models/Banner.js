export default (sequelize, DataTypes) => {
	const Banner = sequelize.define('Banner', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		author_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		image_url: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
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
		tableName: 'banners',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{
				name: 'idx_banner_search',
				fields: ['title', 'description'],
				type: 'FULLTEXT',
			},
		],
		validate: {
			validDates() {
				if ((this.start_date || this.end_date) && !(this.start_date && this.end_date && this.start_date <= this.end_date)) {
					throw new Error('Invalid banner dates');
				}
			},
		},
	});
	
	Banner.associate = (models) => {
		Banner.belongsTo(models.User, {foreignKey: 'author_id', as: 'author', onDelete: 'SET NULL'});
	};
	
	return Banner;
};
