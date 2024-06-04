import { injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { UserService } from './users.service'
import { baseResponse } from '@app/shared/utils/http.utils'

@injectable()
export class UserController {
	constructor(private readonly userService: UserService) {}

	getUser = async (request: Request, response: Response) => {
		const { userId } = request.params
		const data = await this.userService.getUser(userId as string)

		return baseResponse({ response, data })
	}

	getAllUsers = async (request: Request, response: Response) => {
		const qs = request.query
		const data = await this.userService.getAllUsers(qs)

		return baseResponse({ response, data })
	}
}
