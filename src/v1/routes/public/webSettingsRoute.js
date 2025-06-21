'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __webSettings__ from "#controllers/WebSettingController.js";

env.config();
const router = ex.Router();

router.get("/get", asyncHandler(__webSettings__.getWebSettings));

export default router;
