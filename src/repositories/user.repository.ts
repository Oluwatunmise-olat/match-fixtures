import { injectable } from 'tsyringe'

import BaseRepository from './base.repository'
import usersModel from '@app/models/users.model'
import { ObjectLiteral } from '@app/shared/types/base.type'

@injectable()
export class UserRepository extends BaseRepository<any> {
	constructor() {
		super(usersModel)
	}

	public async isEmailTaken(email: string) {
		const result = await this.model.findOne({ email, deleted_at: null })
		return !!result
	}

	public async getUserByEmail(email: string, columns: ObjectLiteral | null = null) {
		const query = this.model.findOne({ email, deleted_at: null })
		if (columns) query.select(columns)

		return await query.exec()
	}

	public async getAllUsers({ username, limit = 10, page = 1 }: ObjectLiteral) {
		const queryPayload = { deleted_at: null }

		if (username) queryPayload['username'] = { $regex: new RegExp(username, 'i') }

		const skipPage = (page - 1) * limit
		return await this.model.find(queryPayload).skip(skipPage).limit(limit).sort({ created_at: -1 })
	}
}
