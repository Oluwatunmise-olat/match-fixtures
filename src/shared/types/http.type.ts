import * as express from 'express'
import { ServiceLayerResponse } from './base.type'

export type Server = express.Express

export type ErrorResponseContract = {
	response: express.Response
	message: string
	data?: any
	errorStatusCode?: number
}

export type SuccessResponseContract = {
	response: express.Response
	message: string
	data?: any
}

export type GenericResponseContract = {
	response: express.Response
	data?: ServiceLayerResponse & { errorStatusCode?: number }
}
