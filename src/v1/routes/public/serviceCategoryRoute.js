'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __serviceCategory__ from "#controllers/ServiceCategoryController.js";

env.config();
const router = ex.Router();

router.get("/get-all", asyncHandler(__serviceCategory__.getAllServiceCategories));

export default router;
