"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";
import cloudinaryConfig from "#configs/cloudinary.js";
import {removeVietnameseTones} from "#utils/removeVietnameseTones.js";
import bcrypt from "bcrypt";
import {getInfoUser} from "#middlewares/authUtils.js";


const {OK, CREATED, NO_CONTENT, BAD_REQUEST, UNAUTHORIZED, NOT_FOUND} = __RESPONSE__;

const getUserById = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object or missing user ID',
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Thông tin xác thực không hợp lệ - Invalid authentication data",
				suggestion: "Vui lòng kiểm tra token và client_id",
			});
		}
		
		const userId = req.keyStore.id;
		if (isNaN(userId)) {
			throw new BAD_REQUEST({
				message: 'User ID must be a positive integer',
				request: req,
			});
		}
		
		const user = await db.User.findByPk(userId, {
			attributes: ['id', 'username', 'email', 'role', 'profile_image', 'first_name', 'last_name', 'gender', 'is_active', 'created_at'],
		});
		
		if (!user) {
			throw new NOT_FOUND({
				message: `User with ID ${userId} not found`,
				request: req,
			});
		}
		
		return {
			user: getInfoUser({
				fields: ['id', 'username', 'email', 'role', 'profile_image', 'first_name', 'last_name', 'gender', 'is_active', 'created_at'],
				object: user,
			}),
		};
	} catch (error) {
		throw error;
	}
};

const getAllUsers = async (req) => {
	try {
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Invalid authentication data",
				suggestion: "Please check token and client_id",
			});
		}
		
		const users = await db.User.findAll({
			attributes: [
				'id',
				'username',
				'email',
				'role',
				'profile_image',
				'first_name',
				'last_name',
				'gender',
				'is_active',
				'created_at',
				[
					db.sequelize.literal(`CASE WHEN role = 'admin' THEN 'manager' ELSE role END`),
					'position'
				],
				[
					db.sequelize.literal(`CONCAT(first_name, ' ', last_name)`),
					'full_name'
				],
				['created_at', 'createdAt'],
				[db.sequelize.literal(`'******'`), 'password_hash']
			],
			order: [['created_at', 'DESC']],
		});
		
		if (!users || users.length === 0) {
			return {
				users: [],
				length: 0,
			};
		}
		
		return {
			users: users,
			length: users.length,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const updateUser = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object or missing user ID',
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Invalid authentication data",
				suggestion: "Please check token and client_id",
			});
		}
		
		const userId = req.keyStore.id;
		const {first_name, last_name, email, gender, is_active} = req.body || {};
		
		let profileImageUrl = null;
		
		if (req.file) {
			const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
			const isImage = allowedTypes.includes(req.file.mimetype);
			const isLt5M = req.file.size / 1024 / 1024 < 5;
			if (!isImage || !isLt5M) {
				throw new BAD_REQUEST({
					message: 'Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh JPG, PNG, GIF, JPEG dưới 5MB.',
					request: req,
				});
			}
			
			profileImageUrl = await new Promise((resolve, reject) => {
				cloudinaryConfig().uploader.upload_stream(
					{
						resource_type: "image",
						folder: `user_profiles/${removeVietnameseTones(first_name || 'unknown')}_${removeVietnameseTones(last_name || 'user')}`,
						public_id: `${removeVietnameseTones(first_name || 'unknown')}_${removeVietnameseTones(last_name || 'user')}_${Date.now()}_${userId}`,
						overwrite: true,
					},
					(error, result) => {
						if (error) {
							return reject(new BAD_REQUEST({
								message: "Lỗi khi tải lên hình ảnh!",
								error,
							}));
						}
						resolve(result.secure_url);
					}
				).end(req.file.buffer);
			});
		} else if (req.body.profile_image) {
			if (typeof req.body.profile_image === 'string' && req.body.profile_image.startsWith('http')) {
				profileImageUrl = req.body.profile_image;
			} else {
				throw new BAD_REQUEST({
					message: 'Định dạng profile_image không hợp lệ. Mong đợi một đối tượng File (thông qua multipart/form-data) hoặc một URL hợp lệ.',
					request: req,
				});
			}
		}
		
		const updateData = {
			first_name,
			last_name,
			email,
			gender,
		};
		
		if (profileImageUrl) {
			updateData.profile_image = profileImageUrl;
		}
		
		const user = await db.User.findByPk(userId,
			{
				attributes: [
					'id',
					'username',
					'email',
					'role',
					'profile_image',
					'first_name',
					'last_name',
					'gender',
					'is_active'
				]
			}
		);
		
		if (!user) {
			throw new BAD_REQUEST({
				message: `User with ID ${userId} not found or does not exist`,
				request: req,
			});
		}
		
		await user.update(updateData);
		
		if (!user) {
			throw new BAD_REQUEST({
				message: 'Failed to update user information',
				request: req,
			});
		}
		
		return {
			user: getInfoUser({
				fields: ['id', 'username', 'email', 'role', 'profile_image', 'first_name', 'last_name', 'gender', 'is_active', 'created_at'],
				object: user,
			}),
		}
		
	} catch (error) {
		if (
			error instanceof BAD_REQUEST ||
			error instanceof UNAUTHORIZED ||
			error instanceof NOT_FOUND
		) {
			throw error;
		}
		if (error.name === "SequelizeUniqueConstraintError") {
			const fields = error.errors?.map(e => e.path).join(", ") || "unknown";
			throw new BAD_REQUEST({
				message: `Trùng lặp/Tồn tại gía trị: [${fields}] đã được sử dụng bởi người dùng khác.`,
				request: req,
			});
		}
		throw error;
	}
};

const createUser = async (req) => {
	try {
		if (!req || typeof req !== "object" || !req.body) {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Invalid authentication data",
				suggestion: "Please check token and client_id",
			});
		}
		
		const adminId = req.keyStore.id;
		if (isNaN(adminId) || adminId <= 0) {
			throw new BAD_REQUEST({
				message: "Admin ID must be a positive integer",
				request: req,
			});
		}
		
		const {email, first_name, last_name, gender, role, is_active} = req.body;
		
		if (!email || typeof email !== "string" || !/^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,10}$/.test(email)) {
			throw new BAD_REQUEST({
				message: "Email is missing or invalid",
				request: req,
			});
		}
		if (first_name && (typeof first_name !== "string" || first_name.trim() === "")) {
			throw new BAD_REQUEST({
				message: "First name is invalid",
				request: req,
			});
		}
		if (last_name && (typeof last_name !== "string" || last_name.trim() === "")) {
			throw new BAD_REQUEST({
				message: "Last name is invalid",
				request: req,
			});
		}
		if (gender && !["nam", "nu", "khac"].includes(gender)) {
			throw new BAD_REQUEST({
				message: "Gender must be 'nam', 'nu', or 'khac'",
				request: req,
			});
		}
		if (role && !["admin", "editor", "user"].includes(role)) {
			throw new BAD_REQUEST({
				message: "Role must be 'admin', 'editor', or 'user'",
				request: req,
			});
		}
		
		const existingUser = await db.User.findOne({
			where: {
				[db.Sequelize.Op.or]: [{email}],
			},
		});
		
		if (existingUser) {
			throw new BAD_REQUEST({
				message: "Email already exists",
				request: req,
			});
		}
		
		const hashedPassword = await bcrypt.hash('Pass@123456', 10);
		
		const user = await db.sequelize.transaction(async (t) => {
			const newUser = await db.User.create({
				email,
				password_hash: hashedPassword,
				first_name,
				last_name,
				gender: gender || 'khac',
				role: role || 'editor',
				profile_image: null,
				is_active: is_active !== undefined ? is_active : true,
				username: new Date().getTime().toString() + Math.floor(Math.random() * 1000),
			}, {transaction: t});
			
			const yearSuffix = new Date().getFullYear().toString().slice(-2);
			const username = `${removeVietnameseTones(first_name || 'user')}${removeVietnameseTones(last_name || '')}${yearSuffix}${newUser.id}`.toLowerCase();
			
			await newUser.update({username}, {transaction: t});
			
			return newUser;
		});
		
		if (!user) {
			throw new BAD_REQUEST({
				message: "Failed to create user",
				request: req,
			});
		}
		
		return {
			user: getInfoUser({
				fields: ['id', 'username', 'email', 'role', 'profile_image', 'first_name', 'last_name', 'gender', 'is_active', 'created_at'],
				object: user,
			}),
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED) {
			throw error;
		}
		throw error;
	}
};

const updateUserRole = async (req) => {
	try {
		if (!req || typeof req !== "object" || !req.body) {
			throw new BAD_REQUEST({
				message: "Invalid request object or missing data",
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Invalid authentication data",
				suggestion: "Please check token and client_id",
			});
		}
		
		const adminId = req.keyStore.id;
		if (isNaN(adminId) || adminId <= 0) {
			throw new BAD_REQUEST({
				message: "Admin ID must be a positive integer",
				request: req,
			});
		}
		
		const {userId, role} = req.body;
		
		if (!userId || isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
				message: "User ID is missing or invalid",
				request: req,
			});
		}
		if (!role || !["admin", "editor", "user"].includes(role)) {
			throw new BAD_REQUEST({
				message: "Role must be 'admin', 'editor', or 'user'",
				request: req,
			});
		}
		
		if (userId === adminId) {
			throw new BAD_REQUEST({
				message: "Cannot update your own role",
				request: req,
			});
		}
		
		const admin = await db.User.findByPk(adminId, {
			attributes: ["id", "role"],
		});
		
		if (!admin || admin.role !== "admin") {
			throw new UNAUTHORIZED({
				message: "Only admins can update user roles",
				request: req,
			});
		}
		
		const user = await db.User.findByPk(userId, {
			attributes: ["id", "username", "email", "role", "profile_image", "first_name", "last_name", "gender", "is_active"],
		});
		
		if (!user) {
			throw new BAD_REQUEST({
				message: `User with ID ${userId} not found`,
				request: req,
			});
		}
		
		await user.update({role}).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to update role user with ID ${id}: ${error.message}`,
				}
			);
		});
		
		return {
			user: getInfoUser({
				fields: ['id', 'username', 'email', 'role', 'profile_image', 'first_name', 'last_name', 'gender', 'is_active', 'created_at'],
				object: user,
			}),
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const changePassword = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: 'Invalid authentication data',
				suggestion: 'Please check token and client_id',
			});
		}
		
		const userId = req.keyStore.id;
		const {old_password, new_password} = req.body || {};
		
		if (!old_password || !new_password) {
			throw new BAD_REQUEST({
				message: 'Old password and new password are required',
				request: req,
			});
		}
		
		if (old_password === new_password) {
			throw new BAD_REQUEST({
				message: 'New password must be different from old password',
				request: req,
			});
		}
		
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{6,}$/;
		if (!passwordRegex.test(new_password)) {
			throw new BAD_REQUEST({
				message: 'New password must be at least 6 characters, include uppercase, lowercase, a number, and a special character',
				request: req,
			});
		}
		
		const user = await db.User.findByPk(userId, {
			attributes: ['id', 'password_hash'],
		});
		
		if (!user) {
			throw new BAD_REQUEST({
				message: `User with ID ${userId} not found`,
				request: req,
			});
		}
		
		const isPasswordValid = await bcrypt.compare(old_password, user?.password_hash);
		if (!isPasswordValid) {
			throw new BAD_REQUEST({
				message: 'Incorrect old password',
				request: req,
			});
		}
		
		const hashedNewPassword = await bcrypt.hash(new_password, 10);
		
		await user.update({
			password_hash: hashedNewPassword,
		}).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to update banner with ID ${id}: ${error.message}`,
					request: req,
				}
			);
		});
		
		return {
			user: user
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const resetPassword = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: 'Invalid authentication data',
				suggestion: 'Please check token and client_id',
			});
		}
		
		const adminId = req.keyStore.id;
		if (isNaN(adminId) || adminId <= 0) {
			throw new BAD_REQUEST({
				message: 'Admin ID must be a positive integer',
				request: req,
			});
		}
		
		const {userId} = req.body;
		
		if (!userId || isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
				message: 'User ID is missing or invalid',
				request: req,
			});
		}
		
		if (userId === adminId) {
			throw new BAD_REQUEST({
				message: 'Cannot reset your own password',
				request: req,
			});
		}
		
		const admin = await db.User.findByPk(adminId, {
			attributes: ['id', 'role'],
		});
		
		if (!admin || admin.role !== 'admin') {
			throw new UNAUTHORIZED({
				message: 'Only admins can reset user passwords',
				request: req,
			});
		}
		
		const user = await db.User.findByPk(userId, {
			attributes: ['id', 'password_hash', 'username', 'email'],
		});
		
		if (!user) {
			throw new BAD_REQUEST({
				message: `User with ID ${userId} not found`,
				request: req,
			});
		}
		
		const defaultPassword = 'Pass@123456';
		const hashedDefaultPassword = await bcrypt.hash(defaultPassword, 10);
		
		await user.update({
			password_hash: hashedDefaultPassword,
		}).catch(error => {
			throw new BAD_REQUEST({
				message: `Failed to reset password for user with ID ${userId}: ${error.message}`,
				request: req,
			});
		});
		return {
			user: user
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const updateUserStatus = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
				message: 'Invalid request object',
				request: req,
			});
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: 'Invalid authentication data',
				suggestion: 'Please check token and client_id',
			});
		}
		
		const adminId = req.keyStore.id;
		if (isNaN(adminId) || adminId <= 0) {
			throw new BAD_REQUEST({
				message: "Admin ID must be a positive integer",
				request: req,
			});
		}
		
		const {userId} = req.body;
		
		if (!userId || isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
				message: "User ID is missing or invalid",
				request: req,
			});
		}
		
		if (userId === adminId) {
			throw new BAD_REQUEST({
				message: "Cannot update your own status",
				request: req,
			});
		}
		
		const admin = await db.User.findByPk(adminId, {
			attributes: ["id", "role"],
		});
		
		if (!admin || admin.role !== "admin") {
			throw new UNAUTHORIZED({
				message: "Only admins can update user status",
				request: req,
			});
		}
		
		const user = await db.User.findByPk(userId, {
			attributes: ["id", "username", "email", "role", "profile_image", "first_name", "last_name", "gender", "is_active"],
		});
		
		if (!user) {
			throw new BAD_REQUEST({
				message: `User with ID ${userId} not found`,
				request: req,
			});
		}
		
		await user.update({
			is_active: !user.is_active,
		}).catch(error => {
			throw new BAD_REQUEST({
				message: `Failed to update status for user with ID ${userId}: ${error.message}`,
				request: req,
			});
		});
		
		return {
			user: user,
		}
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const logout = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
					message: 'Invalid request object',
					request: req,
				}
			);
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: 'Invalid authentication data',
				suggestion: 'Please check token and client_id',
			});
		}
		
		const userId = req.keyStore.id;
		if (isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
					message: 'User ID must be a positive integer',
					request: req,
				}
			);
		}
		
		const {id} = req.body || {};
		
		if (!id || isNaN(id) || id <= 0) {
			throw new BAD_REQUEST({
					message: 'User ID is missing or invalid',
					request: req,
				}
			);
		}
		
		if (id !== userId) {
			throw new BAD_REQUEST({
				message: 'Cannot logout another user',
				request: req,
			});
		}
		
		const user = await db.User.findByPk(userId,
			{
				attributes: ["id", "username", "email", "role", "profile_image", "first_name", "last_name", "gender", "is_active"],
			}
		);
		if (!user) {
			throw new BAD_REQUEST({
					message: `User with ID ${userId} not found`,
					request: req,
				}
			);
		}
		
		await user.update({
			public_key: null,
			access_key: null,
		}).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to logout user with ID ${userId}: ${error.message}`,
					request: req,
				}
			);
		});
		
		return {
			user: user
		}
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
}

const report = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
					message: 'Invalid request object',
					request: req,
				}
			);
		}
		
		const userCountByRole = await db.User.findAll({
			attributes: [
				[db.sequelize.col('role'), 'roleName'],
				[db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count'],
			],
			where: {
				role: ['admin', 'editor'],
			},
			group: ['role'],
			raw: true,
		});
		
		const totalUsers = await db.User.count();
		const totalArticles = await db.Article.count();
		const totalContact = await db.ContactSubmission.count();
		const totalService = await db.Service.count();
		if (!userCountByRole || userCountByRole.length === 0) {
			return {
				userCountByRole: [],
				totalUsers: 0,
				totalArticles: 0,
				totalContact: 0,
				totalService: 0,
			}
		}
		
		return {
			userCountByRole: userCountByRole,
			totalUsers: totalUsers,
			totalArticles: totalArticles,
			totalContact: totalContact,
			totalService: totalService,
		}
	} catch (error) {
		if (error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
}

export {
	getUserById,
	getAllUsers,
	updateUser,
	resetPassword,
	createUser,
	changePassword,
	updateUserStatus,
	updateUserRole,
	logout,
	report
};
