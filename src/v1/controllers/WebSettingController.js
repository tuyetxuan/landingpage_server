"use strict";

import __RESPONSE__ from "#core/index.js";
import {getWebSettings} from "#services/WebSettingService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __webSettings__ = {
	getWebSettings: async (req, res, next) => {
		const __ = await getWebSettings(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: await getWebSettings(req),
				request: req,
				lang: 'vi'
			}).send(res);
	},
};

export default __webSettings__;
