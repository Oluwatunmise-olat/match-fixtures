import { container } from 'tsyringe'
import supertest from 'supertest'
import faker from '@withshepherd/faker'

import { UserRepository } from '../../src/repositories'
import { hashPlainText } from '../../src/shared/utils/hash.util'
import Application from '../app'

const userRepository = container.resolve(UserRepository)

describe('Auth Module', () => {
	let app: Application = container.resolve(Application)
	const request = supertest(app.server)

	beforeAll(() => {
		app.listen(7898)
	})

	afterAll(() => {
		app.close()
	})

	describe('Account Creation', () => {
		test('Given valid account creation payload, should return a success response', async () => {
			const email = 'auth@example.com'

			const response = await request.post('/v1/auth/signup').send({
				email,
				username: faker.random.alpha({ count: 5 }),
				password: faker.random.alphaNumeric(7),
			})

			expect(response.status).toEqual(200)

			const insertedUser = await userRepository.findOne({ email: email })
			expect(insertedUser).toBeDefined()
		})

		test('Given invalid account creation payload, should return a bad request response', async () => {
			const response = await request.post('/v1/auth/signup').send({
				username: faker.random.alpha({ count: 5 }),
				password: faker.random.alphaNumeric(7),
			})

			expect(response.status).toEqual(422)
		})
	})

	describe('Account Login', () => {
		test('Given valid user credentials, should return a success response', async () => {
			const email = 'auth+1@example.com'
			const password = faker.random.alphaNumeric(7)

			const userPayload = {
				email,
				username: faker.random.alpha({ count: 5 }),
				password: await hashPlainText(password),
			}
			const user = await userRepository.create(userPayload)

			const response = await request.post('/v1/auth/login').send({
				email: user.email,
				password,
			})

			expect(response.status).toEqual(200)
			expect(response.body.data).toBeDefined()
			expect(response.body?.data?.token).toBeDefined()
		})

		test('Given invalid login credentials, should return an unauthorized response', async () => {
			const response = await request.post('/v1/auth/login').send({
				email: faker.internet.email(),
				password: faker.random.alphaNumeric(7),
			})

			expect(response.status).toEqual(401)
			expect(response.body?.data?.token).not.toBeDefined()
		})
	})
})
