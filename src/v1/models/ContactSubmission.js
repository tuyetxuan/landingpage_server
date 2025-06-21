export default (sequelize, DataTypes) => {
	const ContactSubmission = sequelize.define('ContactSubmission', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		service_category_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		status_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		author_id: {
			type: DataTypes.BIGINT.UNSIGNED,
			allowNull: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			validate: {
				is: /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
			},
		},
		phone: {
			type: DataTypes.STRING(20),
			allowNull: true,
			validate: {
				is: /^[0-9+][0-9 -]{6,20}$/,
			},
		},
		address: {
			type: DataTypes.STRING(255),
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		notes: {
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
		tableName: 'contact_submissions',
		timestamps: true,
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['name']},
			{fields: ['phone']},
			{fields: ['email']},
		],
	});
	
	ContactSubmission.associate = (models) => {
		ContactSubmission.belongsTo(models.ServiceCategory, {foreignKey: 'service_category_id', as: 'service_category', onDelete: 'SET NULL'});
		ContactSubmission.belongsTo(models.SubmissionStatus, {foreignKey: 'status_id', as: 'status', onDelete: 'SET NULL'});
		ContactSubmission.belongsTo(models.User, {foreignKey: 'author_id', as: 'author', onDelete: 'SET NULL'});
	};
	
	return ContactSubmission;
};
