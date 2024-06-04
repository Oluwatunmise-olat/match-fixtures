import Joi from 'joi'

export const CreateFixturesValidationRule = Joi.object({
	home_team_id: Joi.string().required(),
	away_team_id: Joi.string().required(),
	stadium: Joi.string().lowercase().required(),
	kickoff_at: Joi.date().required(),
})
