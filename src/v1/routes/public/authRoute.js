'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __auth__ from "#controllers/AuthController.js";

env.config();
const router = ex.Router();

router.post("/sign-in", asyncHandler(__auth__.signIn));

export default router;
