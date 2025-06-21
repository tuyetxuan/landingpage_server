export default (sequelize, DataTypes) => {
	const SubmissionStatus = sequelize.define('SubmissionStatus', {
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		status: {
			type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'rejected'),
			defaultValue: 'pending',
		},
		notes: {
			type: DataTypes.TEXT,
		},
		assigned_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
			onUpdate: DataTypes.NOW,
		},
	}, {
		tableName: 'submission_status',
		timestamps: true,
		createdAt: 'assigned_at',
		updatedAt: 'updated_at',
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
		indexes: [
			{fields: ['status']},
		],
	});
	
	SubmissionStatus.associate = (models) => {
		SubmissionStatus.hasMany(models.ContactSubmission, {foreignKey: 'status_id', as: 'contact_submissions'});
	};
	
	return SubmissionStatus;
};
