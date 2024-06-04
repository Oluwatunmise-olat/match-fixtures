import type { RedisClientType } from 'redis'
import * as redis from 'redis'
import { singleton } from 'tsyringe'

import { redisConfig } from '@config/index'
import { NodeEnvironments } from '../enums/models.enum'

@singleton()
export class RedisClient {
	private instance: RedisClientType

	constructor() {
		const connectionDetails = this.getEnvConnectionDetails()

		this.instance = redis.createClient(connectionDetails)
		this.instance.connect()
		this.registerLoggers()
	}

	getInstance(): RedisClientType {
		if (!this.instance) new RedisClient()
		return this.instance
	}

	disconnect() {
		if (this.instance) this.instance.quit()
	}

	private registerLoggers() {
		this.instance.on('error', (error) => console.error('❌ Error occurred connecting to redis', { err: error }))

		this.instance.on('connect', () => console.log('📦 Redis client connected'))
	}

	private getEnvConnectionDetails() {
		let payload = {}

		if ([NodeEnvironments.DEVELOPMENT, NodeEnvironments.TEST]) {
			payload = {
				socket: { host: redisConfig.host, port: redisConfig.port },
				password: redisConfig.password ?? '',
			}
		} else {
			payload = {
				url: redisConfig.url,
			}
		}

		return payload
	}
}
