import { container } from 'tsyringe'

import { UserRoles } from '@app/shared/enums/models.enum'
import { Server } from '@app/shared/types/http.type'
import authGuard from '@shared/middlewares/auth.middleware'
import roleGuard from '@shared/middlewares/role.middleware'
import { UserController } from './users.controller'

const controller = container.resolve(UserController)

export const userRoutes = (server: Server, prefix: string) => {
	server.get(`${prefix}/:userId`, authGuard, roleGuard(UserRoles.ADMIN), controller.getUser)

	server.get(`${prefix}`, authGuard, roleGuard(UserRoles.ADMIN), controller.getAllUsers)
}
