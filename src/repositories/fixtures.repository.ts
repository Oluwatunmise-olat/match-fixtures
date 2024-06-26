import mongoose from 'mongoose'
import { injectable } from 'tsyringe'

import BaseRepository from './base.repository'
import fixturesModel from '@app/models/fixtures.model'
import { ObjectLiteral } from '@app/shared/types/base.type'
import { formatDate } from '@app/shared/utils/date'

@injectable()
export class FixturesRepository extends BaseRepository<any> {
	constructor() {
		super(fixturesModel)
	}

	public async getAllFixtures({ team_id, stadium, status, start_date, end_date, limit = 10, page = 1 }: ObjectLiteral) {
		const queryPayload = { deleted_at: null }
		const dateFormats = 'YYYY-MM-DD HH:mm:ss'

		if (team_id) {
			const teamId = new mongoose.Types.ObjectId(team_id)
			queryPayload['$or'] = [{ home_team_id: teamId }, { away_team_id: teamId }]
		}

		if (start_date && end_date) {
			start_date = formatDate(start_date, dateFormats)
			end_date = formatDate(end_date, dateFormats)

			queryPayload['kickoff_at'] = { $gte: start_date, $lt: end_date }
		}

		if (stadium) {
			queryPayload['stadium'] = { $regex: new RegExp(stadium, 'i') }
		}

		if (status) {
			queryPayload['status'] = status
		}

		const skipPage = (page - 1) * limit
		return await this.model.find(queryPayload).skip(skipPage).limit(limit).sort({ created_at: -1 })
	}

	public async search({ limit = 10, page = 1, query }: ObjectLiteral) {
		return await this.model
			.find({
				$or: [{ stadium: { $regex: new RegExp(query, 'i') }, coach: { $regex: new RegExp(query, 'i') } }],
				deleted_at: null,
			})
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ created_at: -1 })
	}
}
