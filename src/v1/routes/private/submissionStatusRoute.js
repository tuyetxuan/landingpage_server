'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __submissionStatus__ from "#controllers/SubmissionStatusController.js";
import {authentication} from "#middlewares/authUtils.js";

env.config();
const router = ex.Router();

router.get("/get-all", authentication, asyncHandler(__submissionStatus__.getAllSubmissionStatuses));

export default router;
