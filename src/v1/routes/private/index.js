'use strict';

import {env, ex} from '#libs/index.js';

env.config();

const router = ex.Router();

router.get('/', (req, res) => {
		res.json({message: 'Welcome to the API Private!'});
	}
);

export default router;
