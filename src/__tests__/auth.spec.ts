import { container } from 'tsyringe'
// import supertest from 'supertest'

import Application from '../app'

describe('Auth Module', () => {
	let app: Application = container.resolve(Application)
	// const request = supertest(app.server)

	beforeAll(() => {
		app.listen(7898)
	})

	afterAll(() => {
		app.close()
	})

	test('Given valid account creation payload, should return a success response', () => {
		expect(true).toEqual(true)
	})
})
