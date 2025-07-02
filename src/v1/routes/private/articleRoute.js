'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __article__ from "#controllers/ArticleController.js";
import {authentication} from "#middlewares/authUtils.js";
import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});
env.config();
const router = ex.Router();

router.get("/get-all", authentication, asyncHandler(__article__.getAllArticlesForAdmin));
router.post("/create", authentication, upload.single('thumbnail_url'), asyncHandler(__article__.createArticle));
router.post("/update", authentication, upload.single('thumbnail_url'), asyncHandler(__article__.updateArticle));
router.delete("/delete/:article_id", authentication, asyncHandler(__article__.deleteArticle));


export default router;
