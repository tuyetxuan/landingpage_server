"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND} = __RESPONSE__;

const submitContactService = async (req) => {
	try {
		if (!req || typeof req !== "object" || !req.body) {
			throw new BAD_REQUEST({
				message: "Invalid request object",
				request: req,
			});
		}
		
		const {service, name, phone, email, address, message} = req.body;
		const errors = [];
		
		if (!service || (typeof service !== "string" && typeof service !== "number")) {
			errors.push("Service field is missing or invalid (must be a valid number, e.g., 123 or 123.45)");
		} else {
			const serviceString = String(service).trim();
			if (!/^\d+(\.\d*)?$/.test(serviceString)) {
				errors.push("Service field is invalid (must be a valid number, e.g., 123 or 123.45)");
			}
		}
		
		if (!name || typeof name !== "string" || name.trim() === "") {
			errors.push("Name field is missing or invalid");
		}
		if (!phone || typeof phone !== "string" || !/^\+?\d{9,15}$/.test(phone)) {
			errors.push("Phone field is missing or invalid (must be 9-15 digits, optional leading +)");
		}
		if (!email || typeof email !== "string" || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
			errors.push("Email field is missing or invalid (must be a valid email format)");
		}
		if (!address || typeof address !== "string" || address.trim() === "") {
			errors.push("Address field is missing or invalid");
		}
		
		if (errors.length > 0) {
			throw new BAD_REQUEST({
				message: `Validation failed: ${errors.join(", ")}`,
				request: req,
			});
		}
		
		const status = await db.SubmissionStatus.findOne({
			where: {status: "pending"},
		});
		
		if (!status) {
			throw new BAD_REQUEST({
					message: "Submission status 'pending' not found in the database.",
					request: req,
				}
			);
		}
		
		const contact = await db.ContactSubmission.create({
			service_category_id: parseInt(service, 10),
			name: name.trim(),
			phone: phone.trim(),
			email: email.trim(),
			address: address.trim() || "Không có nội dung gửi!",
			message: message || "Không có nội dung gửi!",
			status_id: status?.id || null,
		});
		
		if (!contact) {
			throw new BAD_REQUEST({
				message: "Contact creation failed, please try again later or contact support.",
				request: req,
			});
		}
		
		return {
			name: contact.name,
			phone: contact.phone,
			email: contact.email,
		};
		
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		if (
			error.name === "SequelizeForeignKeyConstraintError" ||
			error.parent?.code === "ER_NO_REFERENCED_ROW_2"
		) {
			let column = "unknown";
			if (error.parent?.sqlMessage) {
				const match = error.parent.sqlMessage.match(/FOREIGN KEY \(`(.+?)`\) REFERENCES/);
				if (match) column = match[1];
			}
			throw new BAD_REQUEST({
				message: `Tham số '${column}' không tồn tại trong hệ thống`,
				request: req,
			});
		}
		throw error;
	}
};

export {
	submitContactService
};
