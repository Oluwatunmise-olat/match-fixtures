import 'reflect-metadata'
import { GenericContainer, StartedTestContainer } from 'testcontainers'
import fs from 'fs'
import path from 'path'
import faker from '@withshepherd/faker'

const env = {
	mongodb: {
		username: faker.random.alpha({ count: 7 }),
		password: faker.random.alphaNumeric(6),
		port: 27017,
		host: 'localhost',
	},
	redis: { port: 6379, host: 'localhost' },
	app: {
		tooling_key: faker.random.alphaNumeric(18),
		key: faker.random.alphaNumeric(12),
		port: 3202,
	},
}

const EnvFilePath = path.join(__dirname, '.env')

/**
 * Cleanup any existing test env file
 */
const cleanEnvFileIfExists = () => {
	if (fs.existsSync(EnvFilePath)) fs.unlinkSync(EnvFilePath)
}

cleanEnvFileIfExists()

const initializeAndSetRedisDependencyEnv = async () => {
	return await new GenericContainer('redis').withExposedPorts(env.redis.port).withName('test-redis').start()
}

export const initializeAndSetMongodbDependencyEnv = async () => {
	return await new GenericContainer('mongo')
		.withEnv('MONGO_INITDB_ROOT_USERNAME', env.mongodb.username)
		.withEnv('MONGO_INITDB_ROOT_PASSWORD', env.mongodb.password)
		.withExposedPorts(env.mongodb.port)
		.withName('test-mongodb')
		.start()
}

let redisContainer: StartedTestContainer | null = null
let mongodbContainer: StartedTestContainer | null = null

/**
 * Initialize Application Dependencies
 */
const initializeDependencies = async () => {
	console.log('⚡️⚡️ Initializing Application Dependencies ⚡️⚡️')

	redisContainer = await initializeAndSetRedisDependencyEnv()
	mongodbContainer = await initializeAndSetMongodbDependencyEnv()

	console.log('🦍 Application Dependencies Initialized 🦍')

	return true
}

/**
 * Write dependencies env to a .env file
 */
const writeTestEnvToFile = () => {
	fs.writeFileSync(
		EnvFilePath,
		`
			MONGO_URI: mongodb://${env.mongodb.host}:${env.mongodb.password}@${env.mongodb.host}:${mongodbContainer?.getMappedPort(
			env.mongodb.port,
		)}
			REDIS_HOST = ${env.redis.host}
			REDIS_PORT = ${redisContainer!.getMappedPort(env.redis.port)}	  
			TOOLING_KEY = ${env.app.tooling_key}
			PORT = ${env.app.port}
			APP_BASE_URL = 0.0.0.0:${env.app.port}
			APP_KEY: ${env.app.key}
			`,
	)
}

;(async () => {
	const isInitialized = await initializeDependencies()

	if (isInitialized && mongodbContainer && redisContainer) {
		writeTestEnvToFile()
	}

	process.exit(0)
})()
