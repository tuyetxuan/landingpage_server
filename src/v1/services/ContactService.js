"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";


const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND, ACCEPTED, UNAUTHORIZED} = __RESPONSE__;

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

const getAllContacts = async (req) => {
	try {
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
					message: "Invalid request object",
				}
			);
		}
		
		if (!req.keyStore || !req.keyStore.id) {
			throw new UNAUTHORIZED({
				message: "Thông tin xác thực không hợp lệ - Invalid authentication data",
				suggestion: "Vui lòng kiểm tra token và client_id",
			});
		}
		
		const contacts = await db.ContactSubmission.findAll({
			attributes: [
				'id',
				'service_category_id',
				'author_id',
				'name',
				'phone',
				'email',
				'address',
				'notes',
				'message',
				'status_id',
				'created_at',
			],
			include: [
				{
					model: db.ServiceCategory,
					as: 'service_category',
					attributes: ['id', 'name'],
					required: false,
				},
				{
					model: db.SubmissionStatus,
					as: 'status',
					attributes: ['id', 'status', 'name'],
					required: false,
				},
				{
					model: db.User,
					as: 'author',
					attributes: ['first_name', 'last_name', 'id'],
					required: false,
				}
			],
			order: [['created_at', 'DESC']],
		});
		if (!contacts || contacts.length === 0) {
			return {
				contacts: [],
				total: 0,
			}
		}
		return {
			contacts: contacts,
			total: contacts.length,
		}
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
}

const updateContact = async (req) => {
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
		if (isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
				message: "User ID must be a positive integer",
				request: req,
			});
		}
		
		const {id, notes, status_id} = req.body;
		
		if (!id || isNaN(id) || id <= 0) {
			throw new BAD_REQUEST({
				message: "Contact ID is missing or invalid",
				request: req,
			});
		}
		
		
		if (notes && (typeof notes !== "string")) {
			throw new BAD_REQUEST({
				message: "Notes field is invalid",
				request: req,
			});
		}
		
		if (status_id && (isNaN(status_id) || status_id <= 0)) {
			throw new BAD_REQUEST({
				message: "Status ID must be a positive integer",
				request: req,
			});
		}
		
		const contact = await db.ContactSubmission.findByPk(id, {
			attributes: [
				"id",
				"service_category_id",
				"author_id",
				"name",
				"phone",
				"email",
				"address",
				"notes",
				"message",
				"status_id",
				"created_at",
			],
		});
		
		if (!contact) {
			throw new NOT_FOUND({
				message: `Contact with ID ${id} not found`,
				request: req,
			});
		}
		
		const updateData = {};
		if (notes !== undefined) updateData.notes = notes;
		if (status_id) updateData.status_id = status_id;
		
		await contact.update(updateData).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to update banner with ID ${id}: ${error.message}`,
					request: req,
				}
			);
		});
		
		return {
			contact: contact,
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND || error instanceof UNAUTHORIZED) {
			throw error;
		}
		if (error.name === "SequelizeForeignKeyConstraintError" || error.parent?.code === "ER_NO_REFERENCED_ROW_2") {
			let column = "unknown";
			if (error.parent?.sqlMessage) {
				const match = error.parent.sqlMessage.match(/FOREIGN KEY \(`(.+?)`\) REFERENCES/);
				if (match) column = match[1];
			}
			throw new BAD_REQUEST({
				message: `Foreign key constraint error on column ${column}`,
				request: req,
			});
		}
		throw new BAD_REQUEST({
			message: `Failed to update contact: ${error.message}`,
			request: req,
		});
	}
};

const updateAuthor = async (req) => {
	try {
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
					message: "Invalid request object",
					request: req,
				}
			);
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
		
		const {id} = req.body;
		
		if (!id || isNaN(id) || id <= 0) {
			throw new BAD_REQUEST({
				message: "Contact ID is missing or invalid",
				request: req,
			});
		}
		
		const contact = await db.ContactSubmission.findByPk(id, {
			attributes: [
				"id",
				"service_category_id",
				"author_id",
				"name",
				"phone",
				"email",
				"address",
				"notes",
				"message",
				"status_id",
				"created_at",
			],
		});
		
		if (!contact) {
			throw new NOT_FOUND({
				message: `Contact with ID ${id} not found`,
				request: req,
			});
		}
		
		if (contact && contact.author_id && contact.author_id !== userId) {
			throw new BAD_REQUEST({
					message: `Contact with ID ${id} already has an author assigned`,
					request: req,
				}
			);
		}
		
		const updateData = {};
		if (userId) updateData.author_id = userId;
		
		await contact.update(updateData).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to update contact with ID ${id}: ${error.message}`,
					request: req,
				}
			);
		});
		
		return {
			contact: contact,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND || error instanceof UNAUTHORIZED) {
			throw error;
		}
		if (error.name === "SequelizeForeignKeyConstraintError" || error.parent?.code === "ER_NO_REFERENCED_ROW_2") {
			let column = "unknown";
			if (error.parent?.sqlMessage) {
				const match = error.parent.sqlMessage.match(/FOREIGN KEY \(`(.+?)`\) REFERENCES/);
				if (match) column = match[1];
			}
			throw new BAD_REQUEST({
				message: `Foreign key constraint error on column ${column}`,
				request: req,
			});
		}
		throw new BAD_REQUEST({
			message: `Failed to update contact: ${error.message}`,
			request: req,
		});
	}
}

const updateStatus = async (req) => {
	try {
		if (!req || typeof req !== "object") {
			throw new BAD_REQUEST({
					message: "Invalid request object",
					request: req,
				}
			);
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
		
		const {status_id, id} = req.body;
		
		if (!id || isNaN(id) || id <= 0) {
			throw new BAD_REQUEST({
					message: "Contact ID is missing or invalid",
					request: req,
				}
			);
		}
		
		if (!status_id || isNaN(status_id) || status_id <= 0) {
			throw new BAD_REQUEST({
				message: "Contact ID is missing or invalid",
				request: req,
			});
		}
		
		const contact = await db.ContactSubmission.findByPk(id, {
			attributes: [
				"id",
				"service_category_id",
				"author_id",
				"name",
				"phone",
				"email",
				"address",
				"notes",
				"message",
				"status_id",
				"created_at",
			],
		});
		
		if (!contact) {
			throw new NOT_FOUND({
				message: `Contact status with ID ${id} not found`,
				request: req,
			});
		}
		
		if (contact && contact.author_id && contact.author_id !== userId) {
			throw new BAD_REQUEST({
					message: `Contact status with ID ${id} not assigned to you or already has an author assigned`,
					request: req,
				}
			);
		}
		
		const updateData = {};
		if (status_id) updateData.status_id = status_id;
		
		await contact.update(updateData).catch(error => {
			throw new BAD_REQUEST({
					message: `Failed to update status with ID ${id}: ${error.message}`,
					request: req,
				}
			);
		});
		
		return {
			contact: contact,
		};
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof NOT_FOUND || error instanceof UNAUTHORIZED) {
			throw error;
		}
		if (error.name === "SequelizeForeignKeyConstraintError" || error.parent?.code === "ER_NO_REFERENCED_ROW_2") {
			let column = "unknown";
			if (error.parent?.sqlMessage) {
				const match = error.parent.sqlMessage.match(/FOREIGN KEY \(`(.+?)`\) REFERENCES/);
				if (match) column = match[1];
			}
			throw new BAD_REQUEST({
				message: `Foreign key constraint error on column ${column}`,
				request: req,
			});
		}
		throw new BAD_REQUEST({
			message: `Failed to update contact: ${error.message}`,
			request: req,
		});
	}
}

const deleteContact = async (req) => {
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
		
		const userId = req.keyStore.id;
		if (isNaN(userId) || userId <= 0) {
			throw new BAD_REQUEST({
				message: "Author ID must be a positive integer",
				request: req,
			});
		}
		
		const {id} = req.params;
		
		if (!id || isNaN(id) || id <= 0) {
			throw new BAD_REQUEST({
				message: "Contact ID is missing or invalid",
				request: req,
			});
		}
		
		const contact = await db.ContactSubmission.findByPk(id, {
			attributes: [
				"id",
				"service_category_id",
				"author_id",
				"name",
				"phone",
				"email",
				"address",
				"notes",
				"message",
				"status_id",
				"created_at",
			],
		});
		
		if (!contact) {
			throw new BAD_REQUEST({
				message: `Contact with ID ${id} not found`,
				request: req,
			});
		}
		
		if (contact.author_id && contact.author_id !== userId) {
			throw new BAD_REQUEST({
					message: `Contact with ID ${id} is not assigned to you or already has an author assigned`,
					request: req,
				}
			);
		}
		
		await contact.destroy().catch(error => {
			throw new BAD_REQUEST({
				message: `Failed to delete contact with ID ${id}: ${error.message}`,
				request: req,
			});
		});
		
		return {
			contact: contact
		};
		
	} catch (error) {
		if (error instanceof BAD_REQUEST || error instanceof UNAUTHORIZED || error instanceof NOT_FOUND) {
			throw error;
		}
		throw error;
	}
}

export {
	submitContactService,
	getAllContacts,
	updateContact,
	updateAuthor,
	updateStatus,
	deleteContact
};
