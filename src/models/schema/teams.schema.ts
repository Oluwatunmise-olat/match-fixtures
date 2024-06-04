import { singleton } from 'tsyringe'
import { SchemaDefinition } from 'mongoose'

import BaseSchema from './base.schema'

@singleton()
export default class TeamsSchema extends BaseSchema {
	constructor() {
		super()

		const modelDefinitions = this.getPropertiesDefinition()
		this.schema.add(modelDefinitions)
		this.schema.index({ name: -1, coach: -1 })
	}

	private getPropertiesDefinition(): SchemaDefinition {
		return {
			name: { type: String, required: true, unique: true },
			coach: { type: String, required: true },
			players: [{ name: String, position: String }],
		}
	}
}
