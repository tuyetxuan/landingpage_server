'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __user__ from "#controllers/UserController.js";
import {authentication, restrictTo} from "#middlewares/authUtils.js";

import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

env.config();
const router = ex.Router();

router.get("/view", authentication, restrictTo(['admin', 'editor']), authentication, asyncHandler(__user__.report));
router.get("/get-all", authentication, restrictTo(['admin']), asyncHandler(__user__.getAllUsers));
router.get("/get-by-id", authentication, restrictTo(['admin', 'editor']), asyncHandler(__user__.getUserById));
router.post("/update-user-role", authentication, restrictTo(['admin']), asyncHandler(__user__.updateUserRole));
router.post("/update-status", authentication, restrictTo(['admin']), asyncHandler(__user__.updateUserStatus));
router.post("/reset-password", authentication, restrictTo(['admin']), asyncHandler(__user__.resetPassword));
router.post("/create", authentication, restrictTo(['admin']), asyncHandler(__user__.createUser));
router.post("/change-password", authentication, restrictTo(['admin', 'editor']), asyncHandler(__user__.changePassword));
router.post("/update", authentication, restrictTo(['admin', 'editor']), upload.single('profile_image'), asyncHandler(__user__.updateUser));
router.post("/logout", authentication, restrictTo(['admin', 'editor']), asyncHandler(__user__.logOut));

export default router;
