import fs from 'fs/promises';
import path from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import Sequelize from 'sequelize';
import process from 'process';
import * as config from '../configs/configdb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db = {};

let sequelize;
const sequelizeOptions = {
	define: {
		timestamps: true,
		underscored: true,
		charset: 'utf8mb4',
		collate: 'utf8mb4_unicode_ci',
	},
	...config[env],
};

if (config[env].use_env_variable) {
	sequelize = new Sequelize(process.env[config[env].use_env_variable], sequelizeOptions);
} else {
	sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, sequelizeOptions);
}

// Function to check database connection
async function checkDatabaseConnection() {
	try {
		await sequelize.authenticate();
		console.log('🚀 Database connection has been established successfully! 🚀');
		return true;
	} catch (error) {
		console.error('🗄️ Unable to connect to the database:', error.message);
		return false;
	}
}

// Export the connection check function
db.checkDatabaseConnection = checkDatabaseConnection;

// Load models asynchronously
async function loadModels() {
	const files = await fs.readdir(__dirname);
	const modelPromises = files
		.filter(file => (
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-3) === '.js' &&
			file.indexOf('.test.js') === -1
		))
		.map(async file => {
			const filePath = path.join(__dirname, file);
			const fileURL = pathToFileURL(filePath).href;
			const model = (await import(fileURL)).default(sequelize, Sequelize.DataTypes);
			db[model.name] = model;
		});
	
	await Promise.all(modelPromises);
}

// Initialize models and associations
async function initialize() {
	try {
		await loadModels();
		Object.keys(db).forEach(modelName => {
			if (db[modelName].associate) {
				db[modelName].associate(db);
			}
		});
		console.log('🚀 Models and associations initialized successfully.');
	} catch (error) {
		console.error(' Error initializing models:', error);
		throw error;
	}
}

// Run initialization
initialize().catch(error => {
	console.error('🚀 Initialization failed:', error);
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
