import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { UserRoles } from '../enums/models.enum'
import { errorResponse } from '../utils/http.utils'

export default (permittedRole: UserRoles) => {
	return async (request: Request, response: Response, next: NextFunction) => {
		try {
			const user = request.user

			if (!user) return errorResponse({ response, message: 'Unauthorized', errorStatusCode: StatusCodes.UNAUTHORIZED })

			if (user.role !== permittedRole)
				return errorResponse({ response, message: 'Not permitted to access', errorStatusCode: StatusCodes.FORBIDDEN })

			return next()
		} catch (error) {
			return errorResponse({ response, message: 'Unauthorized', errorStatusCode: StatusCodes.UNAUTHORIZED })
		}
	}
}
