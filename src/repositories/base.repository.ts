import { Model } from 'mongoose'

import { ObjectLiteral } from '@app/shared/types/base.type'

export default class BaseRepository<T> {
	protected model: Model<T>

	constructor(model: Model<T>) {
		this.model = model
	}

	async create(payload: Partial<T>): Promise<T> {
		return await this.model.create(payload)
	}

	async findOne(payload: Partial<T>) {
		return await this.model.findOne(payload)
	}

	async updateById(id: string, payload: Partial<T>) {
		return await this.model.findByIdAndUpdate(id, { $set: payload })
	}

	async deleteById(id: string) {
		return await this.model.findByIdAndUpdate(id, { $set: { deleted_at: Date.now() } })
	}

	async search({ limit = 10, page = 1, query }: ObjectLiteral) {
		return await this.model
			.find({ $text: { $search: query }, deleted_at: null })
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ created_at: -1 })
	}
}
