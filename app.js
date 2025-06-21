'use strict';
import {cors, env, ex, helmet, morgan} from '#libs/index.js';
import rootRouter from '#routes/index.js';
import {INTERNAL_SERVER_ERROR, NOT_FOUND, OK,} from '#core/index.js';
import db from '#models/index.js';
import {SUCCESS_RESPONSE} from "#core/successResponse.js";
import {ERROR_RESPONSE} from "#core/errorResponse.js";

env.config();

const app = ex();

app.use(cors(
));
app.use(helmet());
app.use(morgan('dev'));
app.use(ex.json());
app.use(ex.urlencoded({extended: true}));

const isConnected = await db.checkDatabaseConnection();

if (!isConnected) {
	console.error('⚠️ Exiting due to database connection failure.');
	process.exit(1);
}

console.log('🚀 Starting application...');
console.log('🚀 Connection pool settings: ', db.sequelize.config.pool);

app.get('/', (req, res) => {
	return new OK({
		message: "Welcome to the API!",
		request: req
	}).send(res);
});

app.use("/api/v1", rootRouter);

app.use((req, res, next) => {
		return new NOT_FOUND({
			message: "Route not found",
			request: req,
			lang: 'vi'
		}).send(res);
	}
);

app.use((err, req, res, next) => {
	console.error('⚠️ Error typeof:', typeof err);
	if (err instanceof SUCCESS_RESPONSE) {
		console.error('⚠️ Custom success occurred:', err);
		return err.send(res);
	}
	if (err instanceof ERROR_RESPONSE) {
		console.error('⚠️ Custom error occurred:', err);
		return err.send(res);
	} else if (err instanceof INTERNAL_SERVER_ERROR) {
		console.error('⚠️ Internal server error:', err);
		next(err);
	} else {
		console.error('⚠️ Unhandled error:', err);
		return res.status(500).json({
			error: 'INTERNAL_SERVER_ERROR',
			message: 'Something went wrong!',
		});
	}
});

app.use((err, req, res, next) => {
		return new INTERNAL_SERVER_ERROR({
			message: err.message,
			request: req,
			lang: 'vi'
		}).send(res);
	}
);

export default app;
