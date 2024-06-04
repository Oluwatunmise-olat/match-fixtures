import { container } from 'tsyringe'
import supertest from 'supertest'
import faker from '@withshepherd/faker'

import { UserRepository } from '../../src/repositories'
import Application from '../app'
import { UserRoles } from '../shared/enums/models.enum'

const userRepository = container.resolve(UserRepository)

describe('Tooling Module', () => {
	let app: Application = container.resolve(Application)
	const request = supertest(app.server)

	beforeAll(() => {
		app.listen(7898)
	})

	afterAll(() => {
		app.close()
	})

	describe('Account Creation', () => {
		test('Given valid tooling auth key and valid account creation payload, should return a success response', async () => {
			const email = 'mail@gmail.com'

			const response = await request
				.post('/v1/tooling/admin')
				.send({
					email,
					username: faker.random.alpha({ count: 5 }),
					password: faker.random.alphaNumeric(7),
				})
				.set({
					'Authorization': 'Bearer tooling_secret_key',
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(200)

			const insertedUser = await userRepository.findOne({ email: email })
			expect(insertedUser).toBeDefined()
			expect(insertedUser.role).toEqual(UserRoles.ADMIN)
		})

		test('Given invalid tooling auth key, should return a bad request response', async () => {
			const response = await request
				.post('/v1/tooling/admin')
				.send({
					email: faker.internet.email(),
					username: faker.random.alpha({ count: 5 }),
					password: faker.random.alphaNumeric(7),
				})
				.set({
					'Authorization': 'Bearer random_secret_key',
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(401)
		})
	})
})
