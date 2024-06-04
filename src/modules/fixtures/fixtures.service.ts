import { StatusCodes } from 'http-status-codes'
import { injectable } from 'tsyringe'

import { FixturesRepository, TeamsRepository } from '@app/repositories'

import { appConfig } from '@app/config'
import { FixtureStatus } from '@app/shared/enums/models.enum'
import { ObjectLiteral, ServiceLayerResponse } from '@app/shared/types/base.type'
import { CreateFixtureDto } from '@app/shared/types/dtos/fixture.dto'
import { FixtureQs } from '@app/shared/types/dtos/qs.dto'
import { setPaginationLimit } from '@app/shared/utils/pagination'

@injectable()
export class FixturesService {
	constructor(
		private readonly teamsRepository: TeamsRepository,
		private readonly fixturesRepository: FixturesRepository,
	) {}

	public async createFixture(payload: CreateFixtureDto): Promise<ServiceLayerResponse> {
		try {
			const teamValidationPayload = { away_team_id: payload.away_team_id, home_team_id: payload.home_team_id }

			const isValidTeam = await this.validTeams(teamValidationPayload)
			if (!isValidTeam) return { status: false, message: 'Invalid Team Id', errorStatusCode: StatusCodes.NOT_FOUND }

			await this.fixturesRepository.create(payload)

			return { status: true, message: 'Fixture created' }
		} catch (error) {
			return { status: false, message: 'An error occurred creating match fixture' }
		}
	}

	public async generateFixtureLink(fixture_id: string): Promise<ServiceLayerResponse> {
		try {
			const fixture = await this.fixturesRepository.findOne({ _id: fixture_id, deleted_at: null })
			if (!fixture) return { status: false, message: 'Invalid fixture Id', errorStatusCode: StatusCodes.NOT_FOUND }

			const baseUrl = appConfig.app_base_url

			const fixtureLink = `${baseUrl}/fixtures/{fixture_id}`

			return { status: true, message: 'Fixture Link Generated', data: { link: fixtureLink } }
		} catch (error) {
			return { status: false, message: 'An error occurred generating fixture link' }
		}
	}

	public async getFixtureDetails(fixture_id: string): Promise<ServiceLayerResponse> {
		try {
			const fixture = await this.fixturesRepository.findOne({ _id: fixture_id, deleted_at: null })
			if (!fixture) return { status: false, message: 'Invalid fixture Id', errorStatusCode: StatusCodes.NOT_FOUND }

			return { status: true, message: 'Fixture Link Generated', data: { fixture } }
		} catch (error) {
			return { status: false, message: 'An error occurred generating fixture link' }
		}
	}

	public async getAllFixtures(qs: FixtureQs | ObjectLiteral = {}): Promise<ServiceLayerResponse> {
		try {
			if (qs.limit) qs.limit = setPaginationLimit(qs.limit)

			const fixtures = await this.fixturesRepository.getAllFixtures(qs)

			return { status: true, message: 'Fixture Link Generated', data: { fixtures } }
		} catch (error) {
			return { status: false, message: 'An error occurred fetching all fixtures' }
		}
	}

	public async deleteFixture(fixture_id: string): Promise<ServiceLayerResponse> {
		try {
			const fixture = await this.fixturesRepository.findOne({ _id: fixture_id, deleted_at: null })
			if (!fixture) return { status: false, message: 'Invalid fixture Id', errorStatusCode: StatusCodes.NOT_FOUND }

			if (fixture.status === FixtureStatus.ONGOING)
				return { status: false, message: 'Cannot delete a fixture already started' }

			if (fixture.status === FixtureStatus.COMPLETED)
				return { status: false, message: 'Cannot delete a completed fixture' }

			await this.fixturesRepository.deleteById(fixture_id)

			return { status: true, message: 'Fixture deleted successfully' }
		} catch (error) {
			return { status: false, message: 'An error occurred deleting fixture' }
		}
	}

	public async updateFixture(fixture_id: string, payload: CreateFixtureDto): Promise<ServiceLayerResponse> {
		try {
			const fixture = await this.fixturesRepository.findOne({ _id: fixture_id, deleted_at: null })
			if (!fixture) return { status: false, message: 'Invalid fixture Id', errorStatusCode: StatusCodes.NOT_FOUND }

			await this.fixturesRepository.updateById(fixture_id, payload)

			return { status: true, message: 'Fixture updated successfully' }
		} catch (error) {
			return { status: false, message: 'An error occurred updating fixture' }
		}
	}

	private async validTeams(payload: Pick<CreateFixtureDto, 'away_team_id' | 'home_team_id'>) {
		const awayTeam = await this.teamsRepository.findOne({ _id: payload.away_team_id, deleted_at: null })
		if (!awayTeam) return false

		const homeTeam = await this.teamsRepository.findOne({ _id: payload.home_team_id, deleted_at: null })
		if (!homeTeam) return false

		return true
	}
}
