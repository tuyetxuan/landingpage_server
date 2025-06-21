'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __submitContact__ from "#controllers/SubmitContactController.js";

env.config();
const router = ex.Router();

router.post("/submit", asyncHandler(__submitContact__.submitContactService));

export default router;
