import Joi from 'joi'

const playerValidationRule = Joi.object({
	name: Joi.string().required().max(200),
	position: Joi.string().required(),
})

export const CreateTeamValidationRule = Joi.object({
	name: Joi.string().required(),
	coach: Joi.string().required(),
	players: Joi.array().items(playerValidationRule),
})
