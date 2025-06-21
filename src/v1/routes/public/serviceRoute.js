'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __service__ from "#controllers/ServiceController.js";

env.config();
const router = ex.Router();

router.get("/get-all", asyncHandler(__service__.getAllServices));
router.get("/get-by-id-category/:category_id", asyncHandler(__service__.getServiceByIdCategory));

export default router;
