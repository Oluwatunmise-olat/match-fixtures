import { StatusCodes } from 'http-status-codes'
import { injectable } from 'tsyringe'

import { TeamsRepository } from '@app/repositories'

import { ObjectLiteral, ServiceLayerResponse } from '@app/shared/types/base.type'
import { TeamQs } from '@app/shared/types/dtos/qs.dto'
import { CreateTeamDto } from '@app/shared/types/dtos/team.dto'
import { setPaginationLimit } from '@app/shared/utils/pagination'

@injectable()
export class TeamsService {
	constructor(private readonly teamRepository: TeamsRepository) {}

	public async createTeam(payload: CreateTeamDto): Promise<ServiceLayerResponse> {
		try {
			const teamNameIsTaken = await this.teamRepository.teamNameTaken(payload.name)
			if (teamNameIsTaken) return { status: false, message: 'Team name is taken' }

			await this.teamRepository.create(payload)

			return { status: true, message: 'Team created successfully' }
		} catch (error) {
			return { status: false, message: 'An error occurred creating team' }
		}
	}

	public async deleteTeam(teamId: string): Promise<ServiceLayerResponse> {
		try {
			await this.teamRepository.deleteById(teamId)

			return { status: true, message: 'Team deleted successfully' }
		} catch (error) {
			return { status: false, message: 'An error occurred deleting team' }
		}
	}

	public async getTeamDetails(teamId: string): Promise<ServiceLayerResponse> {
		try {
			const team = await this.teamRepository.findOne({ id: teamId, deleted_at: null })
			if (!team) return { status: false, message: 'Team not found', errorStatusCode: StatusCodes.NOT_FOUND }

			return { status: true, message: 'Team details fetched successfully', data: team }
		} catch (error) {
			return { status: false, message: 'An error occurred fetching team details' }
		}
	}

	public async updateTeamDetails(teamId: string, payload: Partial<CreateTeamDto>): Promise<ServiceLayerResponse> {
		try {
			const team = await this.teamRepository.findOne({ id: teamId, deleted_at: null })
			if (!team) return { status: false, message: 'Team not found', errorStatusCode: StatusCodes.NOT_FOUND }

			if (payload.name) {
				const teamNameIsTaken = await this.teamRepository.teamNameTaken(payload.name)
				if (teamNameIsTaken) return { status: false, message: 'Team name is taken' }
			}

			await this.teamRepository.updateById(teamId, payload)

			return { status: true, message: 'Team details fetched successfully', data: team }
		} catch (error) {
			return { status: false, message: 'An error occurred fetching team details' }
		}
	}

	public async getAllTeams(qs: TeamQs | ObjectLiteral = {}): Promise<ServiceLayerResponse> {
		try {
			if (qs.limit) qs.limit = setPaginationLimit(qs.limit)

			const teams = await this.teamRepository.getAllTeams(qs)

			return { status: true, message: 'Teams fetched successfully', data: { teams } }
		} catch (error) {
			return { status: false, message: 'An error occurred fetching all teams' }
		}
	}
}
