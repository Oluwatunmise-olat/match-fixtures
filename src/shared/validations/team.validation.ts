import Joi from 'joi'

const playerValidationRule = Joi.object({
	name: Joi.string().required().max(200),
	number: Joi.number().required(),
	position: Joi.string().required().max(3),
})

export const CreateTeamValidationRule = Joi.object({
	name: Joi.string().required(),
	stadium: Joi.string().required(),
	players: Joi.array().items(playerValidationRule),
})
