import { SchemaDefinition } from 'mongoose'
import { singleton } from 'tsyringe'

import BaseSchema from './base.schema'
import { UserRoles } from '@app/shared/enums/models.enum'

@singleton()
export default class UserSchema extends BaseSchema {
	constructor() {
		super()

		const modelDefinitions = this.getPropertiesDefinition()
		this.schema.add(modelDefinitions)
	}

	private getPropertiesDefinition(): SchemaDefinition {
		return {
			username: { type: String, required: true },
			email: { type: String, required: true, unique: true },
			password: { type: String, required: true, select: false },
			role: {
				type: String,
				enum: Object.values(UserRoles),
				default: UserRoles.NORMAL,
			},
		}
	}
}
