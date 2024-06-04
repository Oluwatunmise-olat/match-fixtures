import { StatusCodes } from 'http-status-codes'
import { Request, Response } from 'express'

import { errorResponse } from '../utils/http.utils'
import { appConfig } from '@app/config'

export default async (request: Request, response: Response, next: any) => {
	try {
		const authTag = 'Bearer'
		const baseErr = { response, message: 'Unauthorized', errorStatusCode: StatusCodes.UNAUTHORIZED }

		const authorization = request.headers.authorization

		if (!authorization) return errorResponse(baseErr)

		if (!authorization.startsWith(authTag)) return errorResponse(baseErr)

		const authToken = authorization.replace(`${authTag} `, '')
		if (authToken !== appConfig.tooling_key) return errorResponse(baseErr)

		return next()
	} catch (error) {
		return errorResponse({ response, message: 'Unauthorized', errorStatusCode: StatusCodes.UNAUTHORIZED })
	}
}
