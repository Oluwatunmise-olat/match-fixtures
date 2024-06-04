import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import 'reflect-metadata'
import { container, injectable } from 'tsyringe'
import http from 'http'

import bootUp from './bootup'
import rateLimitMiddleware from './shared/middlewares/rate-limit.middleware'
import applicationRoutes from './shared/routes/index.routes'
import { Server } from './shared/types/http.type'
import { errorHandler, notFoundRoute } from './shared/utils/http.utils'
import { RedisClient } from './shared/utils/redis.utils'

@injectable()
class App {
	public server: Server
	private httpServer: http.Server

	constructor() {
		bootUp()
		this.initializeApp()
		this.initializeAppMiddlewares()
	}

	private initializeApp() {
		this.server = express()
		container.resolve(RedisClient)
	}

	private initializeAppMiddlewares() {
		this.server.use(cors({ origin: '*' }))
		this.server.use(bodyParser.json({ limit: '10mb' }))
		this.server.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
		this.server.use(rateLimitMiddleware({ maxRequests: 100, window: '1m' }))

		applicationRoutes(this.server)
		this.server.use(notFoundRoute)
		this.server.use(errorHandler)
	}

	public async close() {
		container.resolve(RedisClient).disconnect()
		this.httpServer.close()
	}

	public async listen(port: number) {
		this.httpServer = await this.server.listen(port)
	}
}

export default App
