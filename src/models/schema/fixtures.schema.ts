import { Schema, SchemaDefinition } from 'mongoose'
import { singleton } from 'tsyringe'

import { FixtureStatus, ModelNames } from '@app/shared/enums/models.enum'
import BaseSchema from './base.schema'

@singleton()
export default class FixturesSchema extends BaseSchema {
	constructor() {
		super()

		const modelDefinitions = this.getPropertiesDefinition()
		this.schema.add(modelDefinitions)
		this.schema.index({ stadium: -1, home_team_id: -1, away_team_id: -1 })
	}

	private getPropertiesDefinition(): SchemaDefinition {
		return {
			kickoff_at: { type: Date },
			stadium: { type: String, required: true },
			status: { type: String, enum: Object.values(FixtureStatus), default: FixtureStatus.PENDING },
			home_team_id: {
				type: Schema.Types.ObjectId,
				ref: ModelNames.TEAMS,
				required: true,
			},
			away_team_id: {
				type: Schema.Types.ObjectId,
				ref: ModelNames.TEAMS,
				required: true,
			},
		}
	}
}
