import { appConfig } from '@app/config'
import { authRoutes } from '@app/modules/auth/auth.routes'
import { fixturesRoutes } from '@app/modules/fixtures/fixtures.routes'
import { teamRoutes } from '@app/modules/teams/teams.routes'
import { toolingRoutes } from '@app/modules/tooling/tooling.routes'
import { Server } from '../types/http.type'
import { userRoutes } from '@app/modules/users/users.routes'
import { searchRoutes } from '@app/modules/search/service.routes'

const { version } = appConfig

export default (server: Server) => {
	authRoutes(server, `${version}/auth`)
	fixturesRoutes(server, `${version}/fixtures`)
	teamRoutes(server, `${version}/teams`)
	toolingRoutes(server, `${version}/tooling`)
	userRoutes(server, `${version}/users`)
	searchRoutes(server, `${version}/search`)
}
