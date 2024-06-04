import { injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { FixturesService } from './fixtures.service'
import { CreateFixtureDto } from '@app/shared/types/dtos/fixture.dto'
import { baseResponse } from '@app/shared/utils/http.utils'
import { FixtureQs } from '@app/shared/types/dtos/qs.dto'

@injectable()
export class FixturesController {
	constructor(private readonly fixtureService: FixturesService) {}

	// Query filter by status and teams and stadium
	getAllFixtures = async (request: Request, response: Response) => {
		const qs = request.query as FixtureQs
		const data = await this.fixtureService.getAllFixtures(qs)

		return baseResponse({ response, data })
	}

	getFixture = async (request: Request, response: Response) => {
		const { fixtureId } = request.params
		const data = await this.fixtureService.getFixtureDetails(fixtureId as string)

		return baseResponse({ response, data })
	}

	createFixture = async (request: Request, response: Response) => {
		const payload = request.body as CreateFixtureDto
		const data = await this.fixtureService.createFixture(payload)

		return baseResponse({ response, data })
	}

	generateFixtureLink = async (request: Request, response: Response) => {
		const { fixtureId } = request.params
		const data = await this.fixtureService.generateFixtureLink(fixtureId as string)

		return baseResponse({ response, data })
	}

	deleteFixture = async (request: Request, response: Response) => {
		const { fixtureId } = request.params
		const data = await this.fixtureService.deleteFixture(fixtureId as string)

		return baseResponse({ response, data })
	}

	updateFixture = async (request: Request, response: Response) => {
		const { fixtureId } = request.params
		const payload = request.body as CreateFixtureDto
		const data = await this.fixtureService.updateFixture(fixtureId as string, payload)

		return baseResponse({ response, data })
	}
}
