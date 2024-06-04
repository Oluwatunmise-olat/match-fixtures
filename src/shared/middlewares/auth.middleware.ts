import { StatusCodes } from 'http-status-codes'
import { container } from 'tsyringe'
import { NextFunction, Request, Response } from 'express'

import { UserRepository } from '@app/repositories'

import { errorResponse } from '../utils/http.utils'
import { decodeJwtToken } from '../utils/jwt'
import { JwtPayloadContract } from '../types/jwt.type'

const userRepository = container.resolve(UserRepository)

export default async (request: Request, response: Response, next: NextFunction) => {
	try {
		const authTag = 'Bearer'
		const baseErr = { response, message: 'Unauthorized', errorStatusCode: StatusCodes.UNAUTHORIZED }

		const authorization = request.headers.authorization

		if (!authorization) return errorResponse(baseErr)

		if (!authorization.startsWith(authTag)) return errorResponse(baseErr)

		const authToken = authorization.replace(`${authTag} `, '')
		const decodedPayload = decodeJwtToken(authToken) as JwtPayloadContract

		const user = await userRepository.findOne({ _id: decodedPayload.id, deleted_at: null })
		if (!user) return errorResponse(baseErr)

		request.user = user

		return next()
	} catch (error) {
		return errorResponse({ response, message: 'Unauthorized', errorStatusCode: StatusCodes.UNAUTHORIZED })
	}
}
