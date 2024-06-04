import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import { Response, Request } from 'express'

import { errorResponse } from '../utils/http.utils'

export const validate = (rules: Joi.ObjectSchema<any>) => {
	return (req: Request, res: Response, next) => {
		const { error } = rules.validate(req.body, {
			abortEarly: false,
			allowUnknown: true,
		})

		if (!error) return next()

		return errorResponse({
			response: res,
			message: 'Validation errors occurred',
			data: formatValidationError(error),
			errorStatusCode: StatusCodes.UNPROCESSABLE_ENTITY,
		})
	}
}

const formatValidationError = (validationError: Joi.ValidationError) => {
	const errors: any[] = []

	for (const error of validationError.details) {
		const { message, context } = error

		errors.push({
			field: context?.label!,
			message: message.replace(/"/g, ''),
		})
	}
	return errors
}

export default validate
