import { injectable } from 'tsyringe'
import { Request, Response } from 'express'

import { SearchService } from './search.service'
import { ModelNames } from '@app/shared/enums/models.enum'
import { baseResponse } from '@app/shared/utils/http.utils'
import { SearchQs } from '@app/shared/types/dtos/qs.dto'

@injectable()
export class SearchController {
	constructor(private readonly searchService: SearchService) {}

	search = async (request: Request, response: Response) => {
		const qs = request.query as SearchQs
		const { module } = request.query

		const data = await this.searchService.search(qs, module as ModelNames)
		return baseResponse({ response, data })
	}
}
