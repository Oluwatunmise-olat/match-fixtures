import { container } from 'tsyringe'
import supertest from 'supertest'
import faker from '@withshepherd/faker'
import dayjs from 'dayjs'

import { FixturesRepository } from '../../src/repositories'
import Application from '../app'
import { FixtureStatus } from '../shared/enums/models.enum'
import { createAdminUserAndGenerateJwtToken, createNormalUserAndGenerateJwtToken, createTeams } from './helpers'
import { INVALID_OBJECT_ID } from '../../jest.setup'

const fixturesRepository = container.resolve(FixturesRepository)

describe('Fixtures Module', () => {
	let app: Application = container.resolve(Application)
	const request = supertest(app.server)

	beforeAll(() => {
		app.listen(7898)
	})

	afterAll(() => {
		app.close()
	})

	describe('Create Fixture', () => {
		test('Given valid creation payload, should return a success response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('fixtures.admin.user@example.com')
			const [teamOne, teamTwo] = await createTeams(2)
			const payload = {
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			}

			const response = await request
				.post('/v1/fixtures')
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(200)
		})

		test('Given normal user auth token, should return an error response', async () => {
			const { auth_token } = await createNormalUserAndGenerateJwtToken('fixtures.normal.user@example.com')
			const [teamOne, teamTwo] = await createTeams(2)
			const payload = {
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			}

			const response = await request
				.post('/v1/fixtures')
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(403)
		})
	})

	describe('Update Fixture', () => {
		test('Given an invalid fixture id, should return an error response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('fixtures.admin.user+2@example.com')

			const [teamOne, teamTwo] = await createTeams(2)
			const payload = {
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			}

			await fixturesRepository.create({
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			})

			const response = await request
				.put(`/v1/fixtures/${INVALID_OBJECT_ID}`)
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(404)
		})

		test('Given a valid fixture id, should update fixture details and return a success response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('fixtures.admin.user+3@example.com')

			const [teamOne, teamTwo] = await createTeams(2)
			const payload = {
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			}
			const fixture = await fixturesRepository.create(payload)
			const fixtureId = fixture._id

			const response = await request
				.put(`/v1/fixtures/${fixtureId}`)
				.send({ status: FixtureStatus.COMPLETED, ...payload })
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(200)

			const updatedFixture = await fixturesRepository.findOne({ _id: fixtureId })
			expect(updatedFixture.status).toEqual(FixtureStatus.COMPLETED)
		})
	})

	describe('Delete Fixture', () => {
		test('Given an invalid fixture id, should return an error response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('fixtures.admin.user+4@example.com')

			const response = await request.delete(`/v1/fixtures/${INVALID_OBJECT_ID}`).set({
				'Authorization': `Bearer ${auth_token}`,
				'Content-Type': 'application/json',
			})

			expect(response.status).toEqual(404)
		})

		test('Given a valid fixture id, should delete fixture and return a success response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('fixtures.admin.user+5@example.com')

			const [teamOne, teamTwo] = await createTeams(2)

			const fixture = await fixturesRepository.create({
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			})

			const fixtureId = fixture._id.toString()

			const response = await request.delete(`/v1/fixtures/${fixtureId}`).set({
				'Authorization': `Bearer ${auth_token}`,
				'Content-Type': 'application/json',
			})

			expect(response.status).toEqual(200)

			const updatedFixture = await fixturesRepository.findOne({ _id: fixtureId, deleted_at: null })
			expect(updatedFixture).toBeNull()
		})
	})

	describe('Get Fixture Details', () => {
		test('Given normal user auth token, should return success response', async () => {
			const { auth_token } = await createNormalUserAndGenerateJwtToken('fixtures.normal.user+1@example.com')
			const [teamOne, teamTwo] = await createTeams(2)

			await fixturesRepository.create({
				home_team_id: teamOne._id,
				away_team_id: teamTwo._id,
				stadium: faker.random.alpha({ count: 10 }),
				kickoff_at: dayjs(),
			})

			const response = await request.get('/v1/fixtures').set({
				'Authorization': `Bearer ${auth_token}`,
				'Content-Type': 'application/json',
			})

			expect(response.status).toEqual(200)
			expect(response.body).toBeDefined()
			expect(response.body.data.fixtures.length).toBeGreaterThan(0)
		})
	})
})
