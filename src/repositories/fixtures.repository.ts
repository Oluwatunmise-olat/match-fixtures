import mongoose from 'mongoose'
import { injectable } from 'tsyringe'

import BaseRepository from './base.repository'
import fixturesModel from '@app/models/fixtures.model'
import { ObjectLiteral } from '@app/shared/types/base.type'

@injectable()
export class FixturesRepository extends BaseRepository<any> {
	constructor() {
		super(fixturesModel)
	}

	public async getAllFixtures({ team_id, stadium, status, start_date, end_date, limit = 10, page = 1 }: ObjectLiteral) {
		const queryPayload = {}

		if (team_id) {
			const teamId = new mongoose.Types.ObjectId(team_id)
			queryPayload['$or'] = [{ home_team_id: teamId }, { away_team_id: teamId }]
		}

		if (start_date && end_date) {
			queryPayload['kickoff_at'] = { $gte: start_date, $lt: end_date }
		}

		if (stadium) {
			queryPayload['stadium'] = stadium
		}

		if (status) {
			queryPayload['status'] = status
		}

		const skipPage = (page - 1) * limit
		return await this.model.find(queryPayload).skip(skipPage).limit(limit).sort({ created_at: -1 })
	}
}
