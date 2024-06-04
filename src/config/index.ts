import { requiredEnvsOnAppBoot } from '@app/shared/constants/config'

require('dotenv').config()

export const dbConfig = {
	mongodb: {
		uri: process.env.MONGO_URI || '',
	},
}

export const appConfig = {
	port: Number(process.env.PORT) || 34003,
	app_name: process.env.APP_NAME || 'match-fixtures',
	version: process.env.APP_VERSION || 'v1',
	app_key: process.env.APP_KEY,
	app_base_url: process.env.APP_BASE_URL || '',
	tooling_key: process.env.TOOLING_KEY || '',
}

export const redisConfig = {
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	username: process.env.REDIS_USERNAME || 'default',
	password: process.env.REDIS_PASSWORD,
}

/**
 * Configures the environment variables for the application and throws an error if
 * some required environment variables are missing.
 */
export default () => {
	const nullEnvKeys = requiredEnvsOnAppBoot.reduce((accNullEnvs, currEnv) => {
		const currEnvSet = process.env[currEnv.toUpperCase()]

		return currEnvSet ? accNullEnvs : [...accNullEnvs, currEnv]
	}, [])

	if (nullEnvKeys.length) throw new Error(`The following required env variables are missing: ${nullEnvKeys}}`)
}
