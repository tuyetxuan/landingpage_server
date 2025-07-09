'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __banner__ from "#controllers/BannerController.js";
import {authentication, restrictTo} from "#middlewares/authUtils.js";

import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

env.config();
const router = ex.Router();

router.post("/create", authentication, restrictTo(['admin']), upload.single('image_url'), asyncHandler(__banner__.createBanner));
router.get("/get-all", authentication, restrictTo(['admin']), asyncHandler(__banner__.getAllBanners));
router.post("/update", authentication, restrictTo(['admin']), upload.single('image_url'), asyncHandler(__banner__.updateBanner));
router.delete("/delete/:id", authentication, restrictTo(['admin']), asyncHandler(__banner__.deleteBanner));

export default router;
