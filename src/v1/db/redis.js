import Redis from 'ioredis';
import dotenv from 'dotenv';
import {createLogger, format, transports} from 'winston';

// Load environment variables
dotenv.config();

// Logger configuration for Redis events
const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp(),
		format.json()
	),
	transports: [
		new transports.Console(),
		// Add file transport or external service (e.g., ELK, CloudWatch) for production
	],
});

// Environment-specific configuration
const env = process.env.NODE_ENV || 'development';
const redisConfig = {
	development: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseInt(process.env.REDIS_PORT) || 6379,
		password: process.env.REDIS_PASSWORD || null,
		username: process.env.REDIS_USERNAME || null,
		db: parseInt(process.env.REDIS_DB) || 0,
	},
	production: {
		host: process.env.REDIS_HOST || 'redis-16406.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
		port: parseInt(process.env.REDIS_PORT) || 16406,
		password: process.env.REDIS_PASSWORD,
		username: process.env.REDIS_USERNAME || 'default',
		db: parseInt(process.env.REDIS_DB) || 0,
		tls: process.env.REDIS_TLS === 'true' ? {} : null, // Enable TLS in production
	},
};

// Advanced retry strategy with circuit breaker
const retryStrategy = (times) => {
	if (times > 10) {
		logger.error('Max Redis retry attempts reached');
		return null; // Stop retrying after 10 attempts
	}
	const delay = Math.min(times * 100, 3000); // Exponential backoff, max 3s
	logger.warn(`Redis retry attempt ${times}, delaying ${delay}ms`);
	return delay;
};

// Redis client factory for flexibility
class RedisClient {
	constructor(config) {
		this.client = null;
		this.config = {
			...config,
			lazyConnect: true, // Connect only when needed
			retryStrategy,
			maxRetriesPerRequest: 20,
			enableOfflineQueue: true, // Queue commands during disconnects
			connectTimeout: 10000, // 10s timeout
		};
	}
	
	async connect() {
		if (this.client) {
			logger.debug('ℹ️ Reusing existing Redis client connection');
			return this.client;
		}
		
		// Support Redis Cluster if nodes are provided
		if (this.config.nodes) {
			this.client = new Redis.Cluster(this.config.nodes, {
				redisOptions: this.config,
				clusterRetryStrategy: retryStrategy,
			});
		} else {
			this.client = new Redis(this.config);
		}
		
		// Event listeners
		this.client.on('connect', () => {
			logger.info('✅ Redis client connected successfully', {config: this.config});
		});
		
		this.client.on('error', (err) => {
			logger.error('⚠️ Redis client error', {error: err.message});
		});
		
		this.client.on('reconnecting', () => {
			logger.info('🔗 Redis client reconnecting');
		});
		
		this.client.on('close', () => {
			logger.warn('🔒 Redis client connection closed');
		});
		
		// Log commands to verify connection reuse
		this.client.on('command', (cmd) => {
			logger.debug('⚡ Executing Redis command', {command: cmd.name});
		});
		
		try {
			await this.client.connect();
			logger.info('🔗 Redis connection established');
			return this.client;
		} catch (err) {
			logger.error('⚠️ Failed to connect to Redis', {error: err.message});
			throw err;
		}
	}
	
	getClient() {
		return this.client || this.connect();
	}
	
	async disconnect() {
		if (this.client) {
			await this.client.quit();
			logger.info('🔒 Redis client disconnected');
			this.client = null;
		}
	}
}

// Create default Redis client
const defaultClient = new RedisClient(redisConfig[env]);

// Export factory for flexibility
export const createRedisClient = (config = redisConfig[env]) => new RedisClient(config);
export default defaultClient;
