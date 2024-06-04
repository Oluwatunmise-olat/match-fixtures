import { injectable } from 'tsyringe'

import { UserRepository } from '@app/repositories'

import { AccountCreationDto, LoginDto } from '@app/shared/types/dtos/auth.dto'
import { comparePlainAndHashText, hashPlainText } from '@app/shared/utils/hash.util'
import { ServiceLayerResponse } from '@app/shared/types/base.type'
import { generateJwtToken } from '@app/shared/utils/jwt'
import { JwtPayloadContract } from '@app/shared/types/jwt.type'

@injectable()
export class AuthService {
	constructor(private readonly userRepository: UserRepository) {}

	public async signup(payload: AccountCreationDto): Promise<ServiceLayerResponse> {
		try {
			const email = payload.email.toLowerCase()

			const emailIsTaken = await this.userRepository.isEmailTaken(email)
			if (emailIsTaken) return { status: false, message: 'Email already in use!' }

			payload.password = await hashPlainText(payload.password)

			const userPayload = { ...payload, email }

			await this.userRepository.create(userPayload)

			return { status: true, message: 'Account created successfully' }
		} catch (error) {
			return { status: false, message: 'An error occurred creating account.' }
		}
	}

	public async login(payload: LoginDto): Promise<ServiceLayerResponse> {
		try {
			const email = payload.email.toLowerCase()

			const credentialValidationResult = await this.validateUserCredentials(email, payload.password)

			if (!credentialValidationResult.status) return { status: false, message: credentialValidationResult.message }

			const { user } = credentialValidationResult.data!

			const jwtPayload: JwtPayloadContract = { id: user._id, role: user.role }

			const authToken = await generateJwtToken(jwtPayload)

			return {
				status: true,
				message: 'Login Success',
				data: { token: authToken },
			}
		} catch (error) {
			return { status: false, message: 'An error occurred logging in.' }
		}
	}

	private async validateUserCredentials(email: string, password: string) {
		const baseErrMessage = 'Invalid Credentials'

		const user = await this.userRepository.getUserByEmail(email)
		if (!user) return { status: false, message: baseErrMessage }

		const isValidPassword = await comparePlainAndHashText(user.password, password)

		if (isValidPassword) return { status: false, message: baseErrMessage }

		return { status: true, message: 'Valid Credentials', data: { user } }
	}
}
