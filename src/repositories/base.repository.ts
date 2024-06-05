import mongoose, { Model } from 'mongoose'

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

	private mapStringIdToMongodbObjectId(id: string) {
		return new mongoose.Types.ObjectId(id)
	}
}
