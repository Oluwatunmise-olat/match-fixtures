import { injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { ToolingService } from './tooling.service'
import { AccountCreationDto } from '@app/shared/types/dtos/auth.dto'
import { baseResponse } from '@app/shared/utils/http.utils'

@injectable()
export class ToolingController {
	constructor(private readonly toolingService: ToolingService) {}

	createAdmin = async (request: Request, response: Response) => {
		const payload = request.body as AccountCreationDto
		const data = await this.toolingService.createAdmin(payload)

		return baseResponse({ response, data })
	}
}
