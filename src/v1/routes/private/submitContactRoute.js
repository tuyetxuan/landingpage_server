'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __submitContact__ from "#controllers/SubmitContactController.js";
import {authentication} from "#middlewares/authUtils.js";

env.config();
const router = ex.Router();

router.get("/get-all", authentication, asyncHandler(__submitContact__.getAllContacts));

export default router;
