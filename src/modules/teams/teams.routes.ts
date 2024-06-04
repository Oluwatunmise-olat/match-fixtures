import { container } from 'tsyringe'

import validate from '@app/shared/middlewares/validator.middleware'
import { Server } from '@app/shared/types/http.type'
import { TeamsController } from './teams.controller'
import { CreateTeamValidationRule } from '@app/shared/validations/team.validation'

const controller = container.resolve(TeamsController)

export const teamRoutes = (server: Server, prefix: string) => {
	server.post(`${prefix}`, validate(CreateTeamValidationRule), controller.createTeam)
	server.delete(`${prefix}/:teamId`, controller.deleteTeam)
	server.get(`${prefix}`, controller.getAllTeams)
	server.get(`${prefix}/:teamId`, controller.getTeamDetails)
	server.patch(`${prefix}/:teamId`, validate(CreateTeamValidationRule), controller.updateTeamDetails)
}
