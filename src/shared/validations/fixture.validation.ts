import Joi from 'joi'
import { FixtureStatus } from '../enums/models.enum'

export const CreateFixturesValidationRule = Joi.object({
	home_team_id: Joi.string().required(),
	away_team_id: Joi.string().required(),
	stadium: Joi.string().lowercase().required(),
	kickoff_at: Joi.date().required(),
	status: Joi.string().valid(...Object.values(FixtureStatus)),
})
