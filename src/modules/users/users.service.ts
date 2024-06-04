import { injectable } from 'tsyringe'
import { StatusCodes } from 'http-status-codes'

import { UserRepository } from '@app/repositories'

import { ObjectLiteral, ServiceLayerResponse } from '@app/shared/types/base.type'
import { UserQs } from '@app/shared/types/dtos/qs.dto'
import { setPaginationLimit } from '@app/shared/utils/pagination'

@injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	public async getUser(userId: string): Promise<ServiceLayerResponse> {
		try {
			const user = await this.userRepository.findOne({ _id: userId, deleted_at: null })
			if (!user) return { status: false, message: 'User not found', errorStatusCode: StatusCodes.NOT_FOUND }

			return { status: true, message: 'User details fetched successfully', data: user }
		} catch (error) {
			return { status: false, message: 'An error occurred fetching user details' }
		}
	}

	public async getAllUsers(qs: ObjectLiteral | UserQs = {}): Promise<ServiceLayerResponse> {
		try {
			if (qs.limit) qs.limit = setPaginationLimit(qs.limit)

			const users = await this.userRepository.getAllUsers(qs)

			return { status: true, message: 'All users fetched successfully', data: { users } }
		} catch (error) {
			return { status: false, message: 'An error occurred fetching all users' }
		}
	}
}
