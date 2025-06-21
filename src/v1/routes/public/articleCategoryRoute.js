'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __articleCategory__ from "#controllers/ArticleCategoryController.js";

env.config();
const router = ex.Router();

router.get("/get-all", asyncHandler(__articleCategory__.getAllArticleCategories));

export default router;
