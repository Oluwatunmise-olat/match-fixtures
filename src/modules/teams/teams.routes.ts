import { container } from 'tsyringe'

import { UserRoles } from '@app/shared/enums/models.enum'
import validate from '@app/shared/middlewares/validator.middleware'
import { Server } from '@app/shared/types/http.type'
import { CreateTeamValidationRule } from '@app/shared/validations/team.validation'
import authGuard from '@shared/middlewares/auth.middleware'
import roleGuard from '@shared/middlewares/role.middleware'
import { TeamsController } from './teams.controller'

const controller = container.resolve(TeamsController)

export const teamRoutes = (server: Server, prefix: string) => {
	server.post(
		`${prefix}`,
		validate(CreateTeamValidationRule),
		authGuard,
		roleGuard(UserRoles.ADMIN),
		controller.createTeam,
	)

	server.delete(`${prefix}/:teamId`, authGuard, roleGuard(UserRoles.ADMIN), controller.deleteTeam)

	server.get(`${prefix}`, authGuard, controller.getAllTeams)

	server.get(`${prefix}/:teamId`, authGuard, controller.getTeamDetails)

	server.put(
		`${prefix}/:teamId`,
		validate(CreateTeamValidationRule),
		authGuard,
		roleGuard(UserRoles.ADMIN),
		controller.updateTeamDetails,
	)
}
