import { container } from 'tsyringe'

import { Server } from '@app/shared/types/http.type'
import toolingGuard from '@shared/middlewares/tooling.middleware'
import { UserController } from './users.controller'

const controller = container.resolve(UserController)

export const userRoutes = (server: Server, prefix: string) => {
	server.get(`${prefix}/:userId`, controller.getUser)
	server.get(`${prefix}`, toolingGuard, controller.getAllUsers)
}
