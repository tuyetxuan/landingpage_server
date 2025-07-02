"use strict";
import __RESPONSE__ from "#core/index.js";
import db from "#models/index.js";

const {OK, CREATED, NO_CONTENT, BAD_REQUEST, NOT_FOUND, ACCEPTED, UNAUTHORIZED} = __RESPONSE__;

const getAllSubmissionStatuses = async (req) => {
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
		
		const submissionStatus = await db.SubmissionStatus.findAll({
			attributes: [
				'id',
				'status',
				'name',
				'notes',
				'assigned_at',
			],
			order: [['assigned_at', 'DESC']],
		});
		
		if (!submissionStatus || submissionStatus.length === 0) {
			return {
				submission_status: [],
				total: 0,
			}
		}
		
		return {
			submission_status: submissionStatus,
			total: submissionStatus.length
		}
	} catch (error) {
		if (error instanceof NO_CONTENT || error instanceof BAD_REQUEST) {
			throw error;
		}
		throw error;
	}
}

export {
	getAllSubmissionStatuses
};
