import { injectable } from 'tsyringe'

import BaseRepository from './base.repository'
import teamsModel from '@app/models/teams.model'
import { ObjectLiteral } from '@app/shared/types/base.type'

@injectable()
export class TeamsRepository extends BaseRepository<any> {
	constructor() {
		super(teamsModel)
	}

	public async teamNameTaken(name: string) {
		const result = await this.model.findOne({ name, deleted_at: null })

		return !!result
	}

	public async coachExistsWithName(name: string) {
		const result = await this.model.findOne({ coach: name, deleted_at: null })

		return !!result
	}

	public async getAllTeams({ name, coach, limit = 10, page = 1 }: ObjectLiteral) {
		const queryPayload = {}

		if (name) {
			queryPayload['name'] = name
		}

		if (coach) {
			queryPayload['coach'] = coach
		}

		const skipPage = (page - 1) * limit
		return await this.model.find(queryPayload).skip(skipPage).limit(limit).sort({ created_at: -1 })
	}
}
