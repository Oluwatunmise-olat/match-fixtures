import { container } from 'tsyringe'

import validate from '@app/shared/middlewares/validator.middleware'
import { Server } from '@app/shared/types/http.type'
import { FixturesController } from './fixtures.controller'
import { CreateFixturesValidationRule } from '@app/shared/validations/fixture.validation'

const controller = container.resolve(FixturesController)

export const fixturesRoutes = (server: Server, prefix: string) => {
	server.post(`${prefix}`, validate(CreateFixturesValidationRule), controller.createFixture)
	server.get(`${prefix}`, controller.getAllFixtures)
	server.get(`${prefix}/:fixtureId`, controller.getFixture)
	server.delete(`${prefix}/:fixtureId`, controller.deleteFixture)
	server.patch(`${prefix}/:fixtureId`, validate(CreateFixturesValidationRule), controller.updateFixture)
	server.get(`${prefix}/:fixtureId/generate-link`, controller.generateFixtureLink)
}
