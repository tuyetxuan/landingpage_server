"use strict";

import __RESPONSE__ from "#core/index.js";
import {getAllSubmissionStatuses} from "#services/SubmissionStatus.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __submissionStatus__ = {
	getAllSubmissionStatuses: async (req, res) => {
		const __ = await getAllSubmissionStatuses(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.CREATED({
				metadata: __,
				request: req,
				lang: 'vi'
			}).send(res);
	},
};

export default __submissionStatus__;
