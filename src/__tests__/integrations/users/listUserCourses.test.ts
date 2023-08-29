import supertest from 'supertest'
import app from '../../../app'
import { client } from '../../../database'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import {
	createCoursesData,
	createTokenData,
	createUsersData,
} from '../../configs/loadData'
import { TUser } from '../../mocks/interfaces'

describe('Testando rota de listagem de todos os cursos de usuário', () => {
	let tokenAdmin: string
	let tokenNotAdmin: string
	let userNotAdmin: TUser
	let userAdmin: TUser

	beforeAll(async () => {
		await client.connect()
		await configureTestDatabase(client)
		const users = await createUsersData(client)
		const token = await createTokenData(client)
		await createCoursesData(client)
		tokenAdmin = token.tokenAdmin
		tokenNotAdmin = token.tokenNotAdmin
		userAdmin = users.admin
		userNotAdmin = users.notAdmin
	})

	afterAll(async () => {
		await client.end()
	})

	it('GET /users/:id/courses - Sucesso: Listando cursos do usuário com token de admin.', async () => {
		const response = await supertest(app)
			.get(`/users/${userAdmin.id}/courses`)
			.set('Authorization', `Bearer ${tokenAdmin}`)

		expect(response.status).toBe(200)
		expect(Array.isArray(response.body)).toBe(true)
		expect(response.body.length).toBe(2)
		expect(response.body[0]).toHaveProperty('courseId')
		expect(response.body[0]).toHaveProperty('courseName')
		expect(response.body[0]).toHaveProperty('courseDescription')
		expect(response.body[0]).toHaveProperty('userActiveInCourse')
		expect(response.body[0]).toHaveProperty('userId')
		expect(response.body[0]).toHaveProperty('userName')
	})

	it('GET /users/:id/courses - Erro: Listando cursos do usuário com token de não admin.', async () => {
		const response = await supertest(app)
			.get(`/users/${userAdmin.id}/courses`)
			.set('Authorization', `Bearer ${tokenNotAdmin}`)

		expect(response.status).toBe(403)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('Insufficient permission')
	})

	it('GET /users/:id/courses - Erro: Listandos todos os cursos sem enviar token.', async () => {
		const response = await supertest(app).get(`/users/${userAdmin.id}/courses`)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('Missing bearer token')
	})

	it('GET /users/:id/courses - Erro: Listandos todos os cursos enviando token errado.', async () => {
		const response = await supertest(app)
			.get('/users')
			.set('Authorization', `Bearer 1234`)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message')
	})

	it('GET /users/:id/courses - Erro: Listandos todos os cursos de um usuário que não tem cursos vinculados.', async () => {
		const response = await supertest(app)
			.get(`/users/${userNotAdmin.id}/courses`)
			.set('Authorization', `Bearer ${tokenAdmin}`)

		expect(response.status).toBe(404)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('No course found')
	})
})
