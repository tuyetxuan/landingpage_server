"use strict";

const Messages = {
	success: {
		OK: {
			en: "Operation completed successfully",
			vi: "Thao tác hoàn tất thành công",
		},
		CREATED: {
			en: "Resource created successfully",
			vi: "Tài nguyên được tạo thành công",
		},
		UPDATED: {
			en: "Resource updated successfully",
			vi: "Tài nguyên được cập nhật thành công",
		},
		DELETED: {
			en: "Resource deleted successfully",
			vi: "Tài nguyên đã được xóa thành công",
		},
		FETCHED: {
			en: "Data fetched successfully",
			vi: "Dữ liệu được lấy thành công",
		},
	},
	error: {
		BAD_REQUEST: {
			en: "Invalid request parameters",
			vi: "Tham số yêu cầu không hợp lệ",
		},
		UNAUTHORIZED: {
			en: "Authentication required",
			vi: "Cần xác thực để truy cập",
		},
		FORBIDDEN: {
			en: "Access forbidden",
			vi: "Truy cập bị cấm",
		},
		NOT_FOUND: {
			en: "Resource not found",
			vi: "Không tìm thấy tài nguyên",
		},
		METHOD_NOT_ALLOWED: {
			en: "Method not allowed",
			vi: "Phương thức không được phép",
		},
		CONFLICT: {
			en: "Resource conflict",
			vi: "Xung đột tài nguyên",
		},
		REFRESH_TOKEN: {
			en: "Token expired, please refresh",
			vi: "Mã thông báo hết hạn, vui lòng làm mới",
		},
		INTERNAL_SERVER_ERROR: {
			en: "Internal server error",
			vi: "Lỗi máy chủ nội bộ",
		},
		NOT_IMPLEMENTED: {
			en: "Feature not implemented",
			vi: "Tính năng chưa được triển khai",
		},
		BAD_GATEWAY: {
			en: "Bad gateway",
			vi: "Cổng không hợp lệ",
		},
		SERVICE_UNAVAILABLE: {
			en: "Service unavailable",
			vi: "Dịch vụ không khả dụng",
		},
	},
};

const getMessage = (type, code, lang = "en") => {
	if (code === "CUSTOM") {
		return lang === "vi" ? "Thông báo tùy chỉnh" : "Custom message";
	}
	const messageObj = Messages[type]?.[code];
	if (!messageObj) {
		return lang === "vi" ? "Thông báo không xác định" : "Unknown message";
	}
	return messageObj[lang] || messageObj.en || "Message not available";
};

export {Messages, getMessage};
