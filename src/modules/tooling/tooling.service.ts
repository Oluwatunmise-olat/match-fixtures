import { injectable } from 'tsyringe'

import { UserRepository } from '@app/repositories'

import { ServiceLayerResponse } from '@app/shared/types/base.type'
import { AccountCreationDto } from '@app/shared/types/dtos/auth.dto'
import { hashPlainText } from '@app/shared/utils/hash.util'
import { UserRoles } from '@app/shared/enums/models.enum'

@injectable()
export class ToolingService {
	constructor(private readonly userRepository: UserRepository) {}

	public async createAdmin(payload: AccountCreationDto): Promise<ServiceLayerResponse> {
		try {
			const email = payload.email.toLowerCase()

			const emailIsTaken = await this.userRepository.isEmailTaken(email)
			if (emailIsTaken) return { status: false, message: 'Email already in use!' }

			payload.password = await hashPlainText(payload.password)

			const userPayload = { ...payload, email, role: UserRoles.ADMIN }

			await this.userRepository.create(userPayload)
			return { status: true, message: 'Admin user created successfully' }
		} catch (error) {
			return { status: false, message: 'An error occurred creating admin user' }
		}
	}
}
