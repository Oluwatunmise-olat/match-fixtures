import { container } from 'tsyringe'
import supertest from 'supertest'

import { TeamsRepository } from '../../src/repositories'
import Application from '../app'
import { createAdminUserAndGenerateJwtToken, createNormalUserAndGenerateJwtToken, teamPayloadFactory } from './helpers'

const teamsRepository = container.resolve(TeamsRepository)

describe('Teams Module', () => {
	let app: Application = container.resolve(Application)
	const request = supertest(app.server)

	beforeAll(() => {
		app.listen(7898)
	})

	afterAll(() => {
		app.close()
	})

	describe('Create Teams', () => {
		test('Given valid creation payload, should return a success response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('teams.admin.user@example.com')
			const payload = teamPayloadFactory()
			const response = await request
				.post('/v1/teams')
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(200)
		})

		test('Given normal user auth token, should return an error response', async () => {
			const { auth_token } = await createNormalUserAndGenerateJwtToken('teams.normal.user@example.com')
			const payload = teamPayloadFactory()
			const response = await request
				.post('/v1/teams')
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(403)
		})

		test('Given team name is taken, should return an error response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('teams.admin.user+1@example.com')
			const payload = teamPayloadFactory()

			await teamsRepository.create(payload)

			const response = await request
				.post('/v1/teams')
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(400)
		})
	})

	describe('Update Team', () => {
		test('Given an invalid team id, should return an error response', async () => {
			const randomId = '665f1dd1f7ef2657a597d5a7'
			const { auth_token } = await createAdminUserAndGenerateJwtToken('teams.admin.user+2@example.com')
			const payload = teamPayloadFactory()
			const response = await request
				.put(`/v1/teams/${randomId}`)
				.send(payload)
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(404)
		})

		test('Given a valid team id, should update team details and return a success response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('teams.admin.user+3@example.com')

			const payload = teamPayloadFactory()

			const team = await teamsRepository.create(payload)
			const teamId = team._id.toString()

			const response = await request
				.put(`/v1/teams/${teamId}`)
				.send({ ...payload, coach: 'test coach' })
				.set({
					'Authorization': `Bearer ${auth_token}`,
					'Content-Type': 'application/json',
				})

			expect(response.status).toEqual(200)

			const updateTeam = await teamsRepository.findOne({ _id: teamId })
			expect(updateTeam.coach).toEqual('test coach')
		})
	})

	describe('Delete Team', () => {
		test('Given an invalid team id, should return an error response', async () => {
			const randomId = '665f1dd1f7ef2657a597d5a7'

			const { auth_token } = await createAdminUserAndGenerateJwtToken('teams.admin.user+4@example.com')

			const response = await request.delete(`/v1/teams/${randomId}`).set({
				'Authorization': `Bearer ${auth_token}`,
				'Content-Type': 'application/json',
			})

			expect(response.status).toEqual(404)
		})

		test('Given a valid team id, should delete team and return a success response', async () => {
			const { auth_token } = await createAdminUserAndGenerateJwtToken('teams.admin.user+5@example.com')

			const payload = teamPayloadFactory()

			const team = await teamsRepository.create(payload)
			const teamId = team._id.toString()

			const response = await request.delete(`/v1/teams/${teamId}`).set({
				'Authorization': `Bearer ${auth_token}`,
				'Content-Type': 'application/json',
			})

			expect(response.status).toEqual(200)

			const updateTeam = await teamsRepository.findOne({ _id: teamId, deleted_at: null })
			expect(updateTeam).toBeNull()
		})
	})

	describe('Get Team Details', () => {
		test('Given normal user auth token, should return success response', async () => {
			const { auth_token } = await createNormalUserAndGenerateJwtToken('teams.normal.user+1@example.com')
			const payload = teamPayloadFactory()

			await teamsRepository.create(payload)

			const response = await request.get('/v1/teams').set({
				'Authorization': `Bearer ${auth_token}`,
				'Content-Type': 'application/json',
			})

			expect(response.status).toEqual(200)
			expect(response.body).toBeDefined()
			expect(response.body.data.teams.length).toBeGreaterThan(0)
		})
	})
})
