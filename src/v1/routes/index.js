'use strict';
import {ex} from '#libs/index.js';
import publicRoutes from '#routes/public/index.js';
import privateRoutes from '#routes/private/index.js';

const router = ex.Router();

router.use('/public', publicRoutes);
router.use('/private', privateRoutes);

export default router;
