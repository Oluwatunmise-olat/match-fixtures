import { container } from 'tsyringe'
import supertest from 'supertest'

import { createAdminUserAndGenerateJwtToken, createNormalUserAndGenerateJwtToken } from './helpers/index'
import Application from '../app'

describe('User Module', () => {
	let app: Application = container.resolve(Application)
	const request = supertest(app.server)

	beforeAll(() => {
		app.listen(7898)
	})

	afterAll(() => {
		app.close()
	})

	test('Given a normal user token, should return forbidden response', async () => {
		const { auth_token } = await createNormalUserAndGenerateJwtToken('normal.user@example.com')

		const response = await request.get('/v1/users').set({
			'Authorization': `Bearer ${auth_token}`,
			'Content-Type': 'application/json',
		})

		expect(response.status).toEqual(403)
	})

	test('Given an admin token, should return a success response', async () => {
		const { auth_token } = await createAdminUserAndGenerateJwtToken('admin@example.com')

		const response = await request.get('/v1/users').set({
			'Authorization': `Bearer ${auth_token}`,
			'Content-Type': 'application/json',
		})

		expect(response.status).toEqual(200)
		expect(response.body.data).toBeDefined()
	})
})
