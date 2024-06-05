import { injectable } from 'tsyringe'

import { FixturesRepository, TeamsRepository } from '@app/repositories'

import { ModelNames } from '@app/shared/enums/models.enum'
import { ServiceLayerResponse } from '@app/shared/types/base.type'
import { SearchQs } from '@app/shared/types/dtos/qs.dto'
import { setPaginationLimit } from '@app/shared/utils/pagination'

@injectable()
export class SearchService {
	constructor(
		private readonly fixturesRepository: FixturesRepository,
		private readonly teamsRepository: TeamsRepository,
	) {}

	public async search(qs: SearchQs, module: ModelNames): Promise<ServiceLayerResponse> {
		try {
			let data: any[] = []

			switch (module) {
				case ModelNames.FIXTURES:
					data = await this.searchFixture(qs)
					break
				case ModelNames.TEAMS:
					data = await this.searchTeam(qs)
					break
			}

			return { status: true, message: 'Records fetched successfully', data }
		} catch (error) {
			console.error(error)
			return { status: false, message: 'An error occurred fetching records' }
		}
	}

	private async searchFixture(qs: SearchQs) {
		if (qs.limit) qs.limit = setPaginationLimit(qs.limit) as any

		return await this.fixturesRepository.search(qs)
	}

	private async searchTeam(qs: SearchQs) {
		if (qs.limit) qs.limit = setPaginationLimit(qs.limit) as any

		return await this.teamsRepository.search(qs)
	}
}
