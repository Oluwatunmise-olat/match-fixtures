import faker from '@withshepherd/faker'
import { container } from 'tsyringe'

import { UserRepository } from '../../../src/repositories'

import { UserRoles } from '@app/shared/enums/models.enum'
import { JwtPayloadContract } from '@app/shared/types/jwt.type'
import { generateJwtToken } from '@app/shared/utils/jwt'

const userRepository = container.resolve(UserRepository)

export const createAdminUserAndGenerateJwtToken = async (mail: string) => {
	const userCreationPayload = {
		email: mail,
		password: faker.random.alphaNumeric(8),
		username: faker.random.alpha({ count: 7 }),
		role: UserRoles.ADMIN,
	}

	const user = await userRepository.create(userCreationPayload)
	const jwtContract: JwtPayloadContract = { id: user._id, role: user.role }
	const jwtToken = await generateJwtToken(jwtContract)

	return { user, auth_token: jwtToken }
}

export const createNormalUserAndGenerateJwtToken = async (mail: string) => {
	const userCreationPayload = {
		email: mail,
		password: faker.random.alphaNumeric(8),
		username: faker.random.alpha({ count: 7 }),
	}

	const user = await userRepository.create(userCreationPayload)
	const jwtContract: JwtPayloadContract = { id: user._id, role: user.role }
	const jwtToken = await generateJwtToken(jwtContract)

	return { user, auth_token: jwtToken }
}

export const teamPayloadFactory = () => {
	const players = playersPayloadFactory(3)

	return {
		name: faker.random.alphaNumeric(12),
		coach: faker.random.alphaNumeric(6),
		players,
	}
}

export const playersPayloadFactory = (count = 1) => {
	const data: Array<any> = []

	for (let i = 0; i < count; i++) {
		const player = {
			name: faker.random.alphaNumeric(12),
			position: 'Gk',
		}

		data.push(player)
	}

	return data
}
