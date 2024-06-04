import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { ErrorResponseContract, GenericResponseContract, SuccessResponseContract } from '../types/http.type'

export const errorResponse = ({ response, message, data, errorStatusCode }: ErrorResponseContract) => {
	const code = errorStatusCode || StatusCodes.BAD_REQUEST

	response.status(code).send({
		status: false,
		message,
		data,
	})
}

export const successfulResponse = ({ response, data, message }: SuccessResponseContract) => {
	response.status(StatusCodes.OK).send({
		status: true,
		message,
		data,
	})
}

export const baseResponse = ({ response, data }: GenericResponseContract) => {
	const payload = data?.data

	if (!data?.status) {
		return errorResponse({
			response,
			message: data?.message!,
			data: payload,
			errorStatusCode: data?.errorStatusCode || StatusCodes.BAD_REQUEST,
		})
	}

	return successfulResponse({
		response,
		data: payload,
		message: data?.message,
	})
}

export const errorHandler = (err, request: Request, response: Response) => {
	const errorCode = err.statusCode || StatusCodes.BAD_REQUEST || err.errorCode
	const message = err instanceof Error ? err.message : 'Unable to process your request. Please try again'

	errorResponse({
		response,
		message,
		errorStatusCode: errorCode,
	})
}

export const notFoundRoute = (request: Request, response: Response) => {
	errorResponse({
		response: response,
		message: "We can't find the url you are trying to access",
		errorStatusCode: StatusCodes.NOT_FOUND,
	})
}
