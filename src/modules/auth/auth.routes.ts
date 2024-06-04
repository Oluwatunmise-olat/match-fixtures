import { container } from 'tsyringe'

import validate from '@app/shared/middlewares/validator.middleware'
import { Server } from '@app/shared/types/http.type'
import { AccountCreationValidationRule, LoginValidationRule } from '@app/shared/validations/auth.validation'
import { AuthController } from './auth.controller'

const controller = container.resolve(AuthController)

export const authRoutes = (server: Server, prefix: string) => {
	server.post(`${prefix}/signup`, validate(AccountCreationValidationRule), controller.signup)

	server.post(`${prefix}/login`, validate(LoginValidationRule), controller.login)
}
