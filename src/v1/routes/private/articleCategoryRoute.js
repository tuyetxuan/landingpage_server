'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __articleCategory__ from "#controllers/ArticleCategoryController.js";
import {authentication, restrictTo} from "#middlewares/authUtils.js";


env.config();
const router = ex.Router();

router.get("/get-all", authentication, restrictTo(['admin', 'editor']), restrictTo(['admin', 'editor']), asyncHandler(__articleCategory__.getAllArticleCategoriesForAdmin));

export default router;
