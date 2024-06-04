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
		return await this.model.findOne({ name, deleted_at: null })
	}

	public async coachExistsWithName(name: string) {
		const result = await this.model.findOne({ coach: name, deleted_at: null })

		return !!result
	}

	public async getAllTeams({ name, coach, limit = 10, page = 1 }: ObjectLiteral) {
		const queryPayload = { deleted_at: null }

		if (name) {
			queryPayload['name'] = { $regex: new RegExp(name, 'i') }
		}

		if (coach) {
			queryPayload['coach'] = { $regex: new RegExp(coach, 'i') }
		}

		const skipPage = (page - 1) * limit
		return await this.model.find(queryPayload).skip(skipPage).limit(limit).sort({ created_at: -1 })
	}
}
