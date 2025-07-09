'use strict';

import {env, ex} from '#libs/index.js';

env.config();

const router = ex.Router();

router.get('/', (req, res) => {
		res.json({message: 'Welcome to the API Private!'});
	}
);
router.use("/user", (await import('./userRoute.js')).default);
router.use("/banner", (await import('./bannerRoute.js')).default);
router.use("/article", (await import('./articleRoute.js')).default);
router.use("/categoryArticle", (await import('./articleCategoryRoute.js')).default);
router.use("/contact", (await import('./submitContactRoute.js')).default);
router.use("/submission_status", (await import('./submissionStatusRoute.js')).default);
router.use("/report", (await import('./userRoute.js')).default);

export default router;
