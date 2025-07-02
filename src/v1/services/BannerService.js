"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";
import cloudinaryConfig from "#configs/cloudinary.js";
import {removeVietnameseTones} from "#utils/removeVietnameseTones.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

const getAllBanners = async (req) => {
	try {
		if (!req || typeof req !== 'object') {
			throw new BAD_REQUEST({
					message: 'Invalid request object',
					request: req,
				}
			);
		}
		const banners = await db.Banner.findAll({
			attributes: ['id', 'title', 'image_url', 'description', 'author_id', 'is_active', 'created_at'],
			include:
				[
					{
						model: db.User,
						as: 'author',
						attributes: ['first_name', 'last_name'],
						required: false
					}
				],
			order: [
				['created_at', 'DESC'],
			],
		});
		if (!banners || banners.length === 0) {
			return {
				banners: [],
				length: 0,
			};
		}
		return {
			banners: banners,
			length: banners.length,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
}

const createBanner = async (req) => {
	try {
		if (!req || typeof req !== "object" || !req.body) {
			throw new BAD_REQUEST({
				message: "Invalid request object",
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
		
		const {title, image_url, description, is_active} = req.body;
		const errors = [];
		
		if (!title || typeof title !== "string" || title.trim() === "") {
			errors.push("Title field is missing or invalid");
		}
		
		if (errors.length > 0) {
			throw new BAD_REQUEST({
				message: `Validation failed: ${errors.join(", ")}`,
				request: req,
			});
		}
		
		let bannerImage = null;
		
		if (req.file) {
			const isImage = req.file.mimetype.startsWith('image/');
			const isLt5M = req.file.size / 1024 / 1024 < 5;
			if (!isImage || !isLt5M) {
				throw new BAD_REQUEST({
					message: 'Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh có kích thước dưới 5MB.',
					request: req,
				});
			}
			
			bannerImage = await new Promise((resolve, reject) => {
				cloudinaryConfig().uploader.upload_stream(
					{
						resource_type: "image",
						folder: `banners/${new Date().getFullYear()}`,
						public_id: `${removeVietnameseTones(title || 'unknown')}_${Date.now()}_${userId}`,
						overwrite: true,
					},
					(error, result) => {
						if (error) {
							return reject(new BAD_REQUEST({
								message: "Lỗi khi tải lên hình ảnh! " + error.message,
							}));
						}
						resolve(result.secure_url);
					}
				).end(req.file.buffer);
			});
		} else if (req.body.image_url) {
			if (typeof req.body.image_url === 'string' && req.body.image_url.startsWith('http')) {
				bannerImage = req.body.image_url;
			} else {
				throw new BAD_REQUEST({
					message: 'Định dạng image_url không hợp lệ. Mong đợi một đối tượng File (thông qua multipart/form-data) hoặc một URL hợp lệ.',
					request: req,
				});
			}
		}
		
		const banner = await db.Banner.create({
			title,
			image_url: bannerImage || null,
			description,
			author_id: userId || null,
			is_active: is_active ? is_active : true,
		});
		
		if (!banner) {
			throw new BAD_REQUEST({
				message: "Failed to create banner",
				request: req,
			});
		}
		
		return {
			banner: banner,
		}
		
	} catch (error) {
		if (error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
}

const updateBanner = async (req) => {
	try {
		if (!req || typeof req !== "object" || !req.body) {
			throw new BAD_REQUEST({
				message: "Invalid request object",
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
				message: "User ID must be a positive integer",
				request: req,
			});
		}
		
		const {id, title, image_url, description, is_active} = req.body;
		
		if (!id || isNaN(id)) {
			throw new BAD_REQUEST({
				message: "Banner ID is missing or invalid",
				request: req,
			});
		}
		if (title && (typeof title !== "string" || title.trim() === "")) {
			throw new BAD_REQUEST({
				message: "Title field is invalid",
				request: req,
			});
		}
		
		const banner = await db.Banner.findByPk(id);
		if (!banner) {
			throw new NOT_FOUND({
				message: `Banner with ID ${id} not found`,
				request: req,
			});
		}
		
		let bannerImage = banner.image_url;
		if (req.file) {
			const isImage = req.file.mimetype.startsWith("image/");
			const isLt5M = req.file.size / 1024 / 1024 < 5;
			if (!isImage || !isLt5M) {
				throw new BAD_REQUEST({
					message: "Loại tệp hoặc kích thước không hợp lệ. Chỉ chấp nhận hình ảnh có kích thước dưới 5MB.",
					request: req,
				});
			}
			
			const timestamp = Date.now();
			const publicId = `banner_${removeVietnameseTones(title || banner.title || "unknown")}_${timestamp}_${userId}`;
			bannerImage = await new Promise((resolve, reject) => {
				cloudinaryConfig().uploader.upload_stream(
					{
						resource_type: "image",
						folder: `banners/${new Date(banner.created_at).getFullYear()}`,
						public_id: publicId,
						overwrite: true,
					},
					(error, result) => {
						if (error) {
							return reject(new BAD_REQUEST({
								message: "Lỗi khi tải lên hình ảnh! " + error.message,
							}));
						}
						resolve(result.secure_url);
					}
				).end(req.file.buffer);
			});
		} else if (req.body.image_url) {
			if (typeof req.body.image_url === "string" && req.body.image_url.startsWith("http")) {
				bannerImage = req.body.image_url;
			} else {
				throw new BAD_REQUEST({
					message: "Định dạng image_url không hợp lệ. Mong đợi một đối tượng File (thông qua multipart/form-data) hoặc một URL hợp lệ.",
					request: req,
				});
			}
		}
		
		const updateData = {};
		if (title) updateData.title = title;
		if (description !== undefined) updateData.description = description;
		if (bannerImage) updateData.image_url = bannerImage;
		if (is_active !== undefined) updateData.is_active = is_active === "true" || is_active === true;
		updateData.author_id = userId;
		
		await banner.update(updateData).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to update banner with ID ${id}: ${error.message}`,
				}
			);
		});
		
		return {
			banner: banner,
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

const deleteBanner = async (req) => {
	try {
		if (!req || typeof req !== "object" || !req.params || !req.params.id) {
			throw new BAD_REQUEST({
				message: "Invalid request object or missing banner ID",
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
		if (isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
				message: "User ID must be a positive integer",
				request: req,
			});
		}
		
		const bannerId = req.params.id;
		if (isNaN(bannerId) || bannerId <= 0) {
			throw new BAD_REQUEST({
				message: "Banner ID must be a positive integer",
				request: req,
			});
		}
		
		const banner = await db.Banner.findByPk(bannerId);
		if (!banner) {
			throw new BAD_REQUEST({
				message: `Banner with ID ${bannerId} not found`,
				request: req,
			});
		}
		
		if (banner.image_url && banner.image_url.includes("cloudinary.com")) {
			const publicId = banner.image_url.split("/").pop().split(".")[0];
			await cloudinaryConfig().uploader.destroy(`banners/${new Date(banner.created_at).getFullYear()}/${publicId}`).catch((error) => {
				console.warn(`Failed to delete Cloudinary image: ${error.message}`);
			});
		}
		
		await banner.destroy();
		
		return {
			banner: banner
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
};

export {
	createBanner,
	getAllBanners,
	updateBanner,
	deleteBanner
};
