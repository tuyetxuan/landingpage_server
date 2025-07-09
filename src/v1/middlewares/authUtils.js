"use strict";

import jwt from "jsonwebtoken";
import crypto from "crypto";
import __RESPONSE__ from "#core/index.js";
import asyncHandler from "#middlewares/handleError.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, REFRESH_TOKEN} = __RESPONSE__;


const EXPIRES_IN_ACCESS_TOKEN = "15m";
const EXPIRES_IN_REFRESH_TOKEN = "30d";

const getInfoUser = ({fields, object}) => {
	const info = {};
	fields.forEach((field) => {
		info[field] = object[field];
	});
	return info;
};

const createTokenPair = async (payload, publicKey, privateKey) => {
	const jti = crypto.randomBytes(32).toString("hex");
	const tokenPayload = {
		...payload,
		jti,
		iat: Math.floor(Date.now() / 1000),
	};
	try {
		const accessToken = jwt.sign(tokenPayload, publicKey, {expiresIn: EXPIRES_IN_ACCESS_TOKEN});
		const refreshToken = jwt.sign(tokenPayload, privateKey, {expiresIn: EXPIRES_IN_REFRESH_TOKEN});
		return {accessToken, refreshToken};
	} catch (error) {
		throw new error;
	}
};

const authentication = asyncHandler(async (req, res, next) => {
	try {
		if (!req.headers || Object.keys(req.headers).length === 0) {
			throw new UNAUTHORIZED({
				message: "Không tìm thấy headers - Headers not found",
				suggestion: "Please check again your request",
				request: req,
			});
		}
		
		if (!req.headers.client_id || !req.headers.authorization) {
			throw new UNAUTHORIZED({
				message: "Tham số client_id và authorization là bắt buộc - client_id and authorization are required",
				suggestion: "Please check again your request",
				request: req,
			});
		}
		
		const client_id = req.headers.client_id;
		if (!client_id) {
			throw new UNAUTHORIZED({
				message: "Client id is required",
				suggestion: "Please check again your request",
				request: req,
			});
		}
		
		const keyStore = await db.User.findOne({
			where: {
				id: client_id,
			},
			attributes: ["access_key", "public_key", "id"],
		});
		
		if (!keyStore) {
			throw new UNAUTHORIZED({
				message: "Không tìm thấy người dùng trong Token - User not found in Token",
				suggestion: "Please check again your request",
				request: req,
			});
		}
		const accessToken = req.headers.authorization;
		if (!accessToken) {
			throw new UNAUTHORIZED({
				message: "Access token is required",
				suggestion: "Please check again your request",
				request: req,
			});
		}
		
		jwt.verify(accessToken, keyStore.public_key, (error, decoded) => {
			if (error) {
				if (error instanceof jwt.TokenExpiredError) {
					throw new REFRESH_TOKEN({
						message: "Access token hết hạn - Access token expired",
						suggestion: "Please check again your request",
						request: req,
					});
				}
				if (error instanceof jwt.JsonWebTokenError) {
					throw new UNAUTHORIZED({
						message: "Access token giải mã không hợp lệ - Access token is invalid" + error.message,
						suggestion: "Please check again your request",
						request: req,
					});
				}
			}
			if (decoded.id != client_id) {
				throw new UNAUTHORIZED({
					message: "User không hợp lệ với token - User is invalid with token - client_id # userId",
					suggestion: "Please check again your request",
					request: req,
				});
			}
			req.keyStore = keyStore;
			return next();
		});
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof FORBIDDEN || error instanceof UNAUTHORIZED || error instanceof REFRESH_TOKEN) {
			throw error;
		}
		throw error;
	}
});

const restrictTo = (allowedRoles) => {
	return async (req, res, next) => {
		try {
			if (!req.keyStore || !req.keyStore.id) {
				throw new UNAUTHORIZED({
					message: "Thông tin xác thực không hợp lệ - Invalid authentication data",
					suggestion: "Vui lòng kiểm tra token và client_id",
				});
			}
			const user = await db.User.findOne({
				where: {id: req.keyStore.id},
				attributes: ["id", "role", 'is_active'],
			});
			
			if (!user) {
				throw new UNAUTHORIZED({
					message: "Người dùng không tồn tại - User not found",
				});
			}
			
			if (!allowedRoles.includes(user?.role)) {
				throw new FORBIDDEN({
					message: "Không có quyền truy cập - Access denied",
					request: req,
				});
			}
			
			if (user?.is_active === false) {
				throw new FORBIDDEN({
					message: "Tài khoản của bạn đã bị khóa (Vui lòng liên hệ Admin để mở khóa) - Your account has been locked",
					request: req,
				});
			}
			
			next();
		} catch (error) {
			if (error instanceof BAD_REQUEST || error instanceof FORBIDDEN) {
				throw error;
			}
			throw error;
		}
	};
};

const handlerRefreshToken = async (req, res) => {
	try {
		if (!req || typeof req !== "object") {
			throw new UNAUTHORIZED({
				message: "Yêu cầu không hợp lệ - Invalid request object",
				suggestion: "Vui lòng kiểm tra yêu cầu của bạn",
				request: req
			});
		}
		
		const {refresh_token, client_id} = req.body;
		if (!refresh_token || !client_id) {
			throw new UNAUTHORIZED({
				message: "Thiếu refreshToken hoặc idUser - Missing refreshToken or idUser",
				suggestion: "Vui lòng cung cấp đầy đủ thông tin",
				request: req
			});
		}
		
		const user = await db.User.findOne({
			where: {id: client_id},
		});
		
		if (!user) {
			throw new UNAUTHORIZED({
				message: "Người dùng không tồn tại - User not found",
				suggestion: "Vui lòng kiểm tra idUser",
				request: req
			});
		}
		
		let decoded;
		try {
			decoded = verifyToken(refresh_token, user.access_key);
		} catch (error) {
			throw new UNAUTHORIZED({
				message: "Token không hợp lệ - Invalid refresh token",
				suggestion: "Vui lòng đăng nhập lại",
			});
		}
		
		if (!decoded || decoded.id !== user?.id) {
			throw new UNAUTHORIZED({
				message: "Token không hợp lệ hoặc không khớp với người dùng - Token mismatch",
				suggestion: "Vui lòng đăng nhập lại",
			});
		}
		
		const accessToken = jwt.sign({
			id: user.id,
			email: user.email,
			phone: user.phone,
			first_name: user.first_name,
			last_name: user.last_name,
			role: user.role,
		}, user.public_key, {expiresIn: EXPIRES_IN_ACCESS_TOKEN});
		
		return {
			token_type: "Bearer",
			access_token: accessToken,
			expires_in: EXPIRES_IN_ACCESS_TOKEN,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED) {
			throw error;
		}
		throw error;
	}
};

const verifyToken = (token, keySecret) => {
	return jwt.verify(token, keySecret, (err, decoded) => {
		if (err) {
			return null;
		}
		return decoded;
	});
};

export {
	createTokenPair,
	authentication,
	restrictTo,
	handlerRefreshToken,
	getInfoUser,
	verifyToken
}
