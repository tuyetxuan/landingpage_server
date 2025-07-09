'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __banner__ from "#controllers/BannerController.js";

import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

env.config();
const router = ex.Router();

router.get("/get-all", asyncHandler(__banner__.getAll));

export default router;
