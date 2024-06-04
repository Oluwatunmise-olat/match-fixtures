import { container } from 'tsyringe'

import { Server } from '@app/shared/types/http.type'
import { SearchController } from './search.controller'

const controller = container.resolve(SearchController)

export const searchRoutes = (server: Server, prefix: string) => {
	server.get(`${prefix}`, controller.search)
}
