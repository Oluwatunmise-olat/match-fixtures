import { container } from 'tsyringe'

import validate from '@app/shared/middlewares/validator.middleware'
import { Server } from '@app/shared/types/http.type'
import { FixturesController } from './fixtures.controller'
import { CreateFixturesValidationRule } from '@app/shared/validations/fixture.validation'
import authGuard from '@shared/middlewares/auth.middleware'
import roleGuard from '@shared/middlewares/role.middleware'
import { UserRoles } from '@app/shared/enums/models.enum'

const controller = container.resolve(FixturesController)

export const fixturesRoutes = (server: Server, prefix: string) => {
	server.post(
		`${prefix}`,
		validate(CreateFixturesValidationRule),
		authGuard,
		roleGuard(UserRoles.ADMIN),
		controller.createFixture,
	)
	server.get(`${prefix}`, authGuard, controller.getAllFixtures)

	server.get(`${prefix}/:fixtureId`, authGuard, controller.getFixture)

	server.delete(`${prefix}/:fixtureId`, authGuard, roleGuard(UserRoles.ADMIN), controller.deleteFixture)

	server.put(
		`${prefix}/:fixtureId`,
		validate(CreateFixturesValidationRule),
		authGuard,
		roleGuard(UserRoles.ADMIN),
		controller.updateFixture,
	)

	server.get(`${prefix}/:fixtureId/generate-link`, authGuard, controller.generateFixtureLink)
}
