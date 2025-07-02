export default (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		username: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
			validate: {
				is: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/,
			},
		},
		first_name: {
			type: DataTypes.STRING(50),
			validate: {
				len: [2, 50],
			},
		},
		last_name: {
			type: DataTypes.STRING(50),
			validate: {
				len: [2, 50],
			},
		},
		profile_image: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		gender: {
			type: DataTypes.ENUM('nam', 'nu', 'khac'),
			allowNull: false,
			defaultValue: 'khac',
		},
		public_key: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		access_key: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		role: {
			type: DataTypes.ENUM('admin', 'editor'),
			allowNull: false,
		},
		password_hash: {
			type: DataTypes.STRING(255),
			allowNull: false,
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
		tableName: 'users',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['is_active']},
			{fields: ['email']},
			{fields: ['username']},
		],
	});
	
	User.associate = (models) => {
		User.hasMany(models.Banner, {foreignKey: 'author_id', as: 'banners'});
		User.hasMany(models.Service, {foreignKey: 'author_id', as: 'services'});
		User.hasMany(models.Article, {foreignKey: 'author_id', as: 'authored_articles'});
		User.hasMany(models.ContactSubmission, {foreignKey: 'author_id', as: 'contact_submissions'});
		User.hasMany(models.WebsiteSetting, {foreignKey: 'author_id', as: 'website_settings'});
	};
	
	return User;
};
