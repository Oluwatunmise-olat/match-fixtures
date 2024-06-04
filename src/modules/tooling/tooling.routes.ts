import { container } from 'tsyringe'

import validate from '@app/shared/middlewares/validator.middleware'
import { Server } from '@app/shared/types/http.type'
import { AccountCreationValidationRule } from '@app/shared/validations/auth.validation'
import toolingGuard from '@shared/middlewares/tooling.middleware'
import { ToolingController } from './tooling.controller'

const controller = container.resolve(ToolingController)

export const toolingRoutes = (server: Server, prefix: string) => {
	server.post(`${prefix}/admin`, validate(AccountCreationValidationRule), toolingGuard, controller.createAdmin)
}
