'use strict';
import {env, ex} from '#libs/index.js';

env.config();
const router = ex.Router();

router.get('/', (req, res) => {
	res.json({message: 'Welcome to the API Public!'});
});

router.use("/web-settings", (await import('./webSettingsRoute.js')).default);
router.use("/service-category", (await import('./serviceCategoryRoute.js')).default);
router.use("/service", (await import('./serviceRoute.js')).default);
router.use("/article", (await import('./articleRoute.js')).default);
router.use("/article-category", (await import('./articleCategoryRoute.js')).default);
router.use("/contact", (await import('./submitContactRoute.js')).default);
router.use("/auth", (await import('./authRoute.js')).default);
router.use("/banner", (await import('./bannerRoute.js')).default);

export default router;
