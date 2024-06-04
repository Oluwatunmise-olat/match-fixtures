import { injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { TeamsService } from './teams.service'
import { CreateTeamDto } from '@app/shared/types/dtos/team.dto'
import { baseResponse } from '@app/shared/utils/http.utils'
import { TeamQs } from '@app/shared/types/dtos/qs.dto'

@injectable()
export class TeamsController {
	constructor(private readonly teamsService: TeamsService) {}

	getAllTeams = async (request: Request, response: Response) => {
		const qs = request.params as TeamQs
		const data = await this.teamsService.getAllTeams(qs)

		return baseResponse({ response, data })
	}

	getTeamDetails = async (request: Request, response: Response) => {
		const { teamId } = request.query
		const data = await this.teamsService.getTeamDetails(teamId as string)

		return baseResponse({ response, data })
	}

	updateTeamDetails = async (request: Request, response: Response) => {
		const { teamId } = request.query
		const payload = request.body as CreateTeamDto
		const data = await this.teamsService.updateTeamDetails(teamId as string, payload)

		return baseResponse({ response, data })
	}

	deleteTeam = async (request: Request, response: Response) => {
		const { teamId } = request.query
		const data = await this.teamsService.deleteTeam(teamId as string)

		return baseResponse({ response, data })
	}

	createTeam = async (request: Request, response: Response) => {
		const payload = request.body as CreateTeamDto
		const data = await this.teamsService.createTeam(payload)

		return baseResponse({ response, data })
	}
}

// - TODO :: PostMan Docs, Write Tests, Caching, Guard routes
