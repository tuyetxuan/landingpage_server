"use strict";

import __RESPONSE__ from "#core/index.js";
import {signIn,} from "#services/AuthService.js";
import {SUCCESS_RESPONSE} from "#core/successResponse.js";

const __auth__ = {
	signIn: async (req, res, next) => {
		const __ = await signIn(req);
		if (__ instanceof SUCCESS_RESPONSE)
			return __.send(res);
		else
			new __RESPONSE__.FETCHED({
				metadata: await signIn(req),
				request: req,
				lang: 'vi'
			}).send(res);
	},
};

export default __auth__;
