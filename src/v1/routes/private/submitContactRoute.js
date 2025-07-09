'use strict';
import {env, ex} from '#libs/index.js';
import asyncHandler from "#middlewares/handleError.js";
import __submitContact__ from "#controllers/SubmitContactController.js";
import {authentication, restrictTo} from "#middlewares/authUtils.js";

env.config();
const router = ex.Router();

router.get("/get-all", authentication, restrictTo(['admin']), asyncHandler(__submitContact__.getAllContacts));
router.post("/update", authentication, restrictTo(['admin']), asyncHandler(__submitContact__.updateContact));
router.post("/update-author", authentication, restrictTo(['admin']), asyncHandler(__submitContact__.updateAuthor));
router.post("/update-status", authentication, restrictTo(['admin']), asyncHandler(__submitContact__.updateStatus));
router.delete("/delete/:id", authentication, restrictTo(['admin']), asyncHandler(__submitContact__.deleteContact));

export default router;
