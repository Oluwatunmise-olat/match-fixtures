import { Request, Response } from 'express'
import { injectable } from 'tsyringe'

import { AccountCreationDto, LoginDto } from '@app/shared/types/dtos/auth.dto'
import { baseResponse } from '@app/shared/utils/http.utils'
import { AuthService } from './auth.service'

@injectable()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	signup = async (request: Request, response: Response) => {
		const payload = request.body as AccountCreationDto
		const data = await this.authService.signup(payload)

		return baseResponse({ response, data })
	}

	login = async (request: Request, response: Response) => {
		const payload = request.body as LoginDto
		const data = await this.authService.login(payload)

		return baseResponse({ response, data })
	}
}
