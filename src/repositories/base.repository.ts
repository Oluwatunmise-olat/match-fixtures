import mongoose, { Model } from 'mongoose'

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
		const _payload = payload as any
		if (_payload._id as any) _payload._id = this.mapStringIdToMongodbObjectId(_payload._id)

		return await this.model.findOne(_payload)
	}

	async updateById(id: string, payload: Partial<T>) {
		const objectId = this.mapStringIdToMongodbObjectId(id)

		return await this.model.findByIdAndUpdate(objectId, { $set: payload })
	}

	async deleteById(id: string) {
		const objectId = this.mapStringIdToMongodbObjectId(id)

		return await this.model.findByIdAndUpdate(objectId, { $set: { deleted_at: Date.now() } })
	}

	async search({ limit = 10, page = 1, query }: ObjectLiteral) {
		return await this.model
			.find({ $text: { $search: query }, deleted_at: null })
			.skip((page - 1) * limit)
			.limit(limit)
			.sort({ created_at: -1 })
	}

	private mapStringIdToMongodbObjectId(id: string) {
		return new mongoose.Types.ObjectId(id)
	}
}
