'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __article__ from "#controllers/ArticleController.js";

env.config();
const router = ex.Router();

router.get("/get-all", asyncHandler(__article__.getAllArticles));
router.get("/get-by-id/:slug", asyncHandler(__article__.getArticleById));

export default router;
