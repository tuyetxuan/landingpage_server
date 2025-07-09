"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {createTokenPair, getInfoUser} from "#middlewares/authUtils.js";

const {OK, BAD_REQUEST, NOT_FOUND, UNAUTHORIZED, REFRESH_TOKEN} = __RESPONSE__;

const signIn = async (req) => {
	try {
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
		const {email, password} = req.body;
		
		if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			throw new BAD_REQUEST({
				message: "Email không hợp lệ hoặc bị thiếu - Invalid or missing email",
			});
		}
		
		if (
			!password ||
			password.length < 6 ||
			!/[A-Z]/.test(password) ||
			!/[a-z]/.test(password) ||
			!/[0-9]/.test(password) ||
			!/[!@#$%^&*(),.?":{}|<>]/.test(password)
		) {
			throw new BAD_REQUEST({
				message: "Password phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt",
			});
		}
		
		if (!email || !password) {
			throw new BAD_REQUEST({
				message: "Email hoặc Password không được phép để trống - Missing username or password",
			});
		}
		
		const user = await db.User.findOne({
			where: {email},
		});
		
		if (!user) {
			throw new NOT_FOUND({
				message: "Không tìm thấy User - User not found",
			});
		}
		
		if (user?.is_active === false) {
			throw new BAD_REQUEST({
				message: "Tài khoản của bạn đã bị khóa (Vui lòng liên hệ Admin để mở khóa) - Your account has been locked",
				request: req,
			});
		}
		
		const isPasswordValid = await bcrypt.compare(
			password,
			user.password_hash
		);
		
		if (!isPasswordValid) {
			throw new BAD_REQUEST({
				message: "Mật khẩu không khớp - Invalid password"
			});
		}
		
		const privateKey = crypto.randomBytes(64).toString("hex");
		const publicKey = crypto.randomBytes(64).toString("hex");
		
		const tokens = await createTokenPair(
			{
				id: user.id,
				email: user.email,
				phone: user.phone,
				first_name: user.first_name,
				last_name: user.last_name,
				role: user.role
			},
			publicKey,
			privateKey
		);
		
		await db.User.update(
			{
				public_key: publicKey,
				access_key: privateKey
			},
			{
				where: {id: user.id},
			}
		);
		
		if (!publicKey || !privateKey) {
			throw new BAD_REQUEST({
				message: "Lỗi tạo token - Error creating token",
				suggestion: "Vui lòng thử lại sau",
			});
		}
		
		return {
			user: getInfoUser({
				fields: [
					"id",
					"email",
					"first_name",
					"last_name",
					"profile_image",
					"role"
				],
				object: user,
			}),
			tokens,
		};
	} catch (error) {
		
		if (error instanceof BAD_REQUEST) {
			throw error;
		}
		
		throw error;
	}
};

export {
	signIn,
};
