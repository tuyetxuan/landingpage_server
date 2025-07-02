'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __user__ from "#controllers/UserController.js";
import {authentication} from "#middlewares/authUtils.js";

import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

env.config();
const router = ex.Router();

router.get("/get-all", authentication, asyncHandler(__user__.getAllUsers));
router.get("/get-by-id", authentication, asyncHandler(__user__.getUserById));
router.post("/update-user-role", authentication, asyncHandler(__user__.updateUserRole));
router.post("/update-status", authentication, asyncHandler(__user__.updateUserStatus));
router.post("/reset-password", authentication, asyncHandler(__user__.resetPassword));
router.post("/create", authentication, asyncHandler(__user__.createUser));
router.post("/change-password", authentication, asyncHandler(__user__.changePassword));
router.post("/update", authentication, upload.single('profile_image'), asyncHandler(__user__.updateUser));
router.post("/logout", authentication, asyncHandler(__user__.logOut));


export default router;
