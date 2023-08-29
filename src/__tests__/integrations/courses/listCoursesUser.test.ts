import supertest from 'supertest'
import app from '../../../app'
import { client } from '../../../database'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import {
	createCoursesData,
	createTokenData,
	createUsersData,
} from '../../configs/loadData'
import { TCourse, TUser } from '../../mocks/interfaces'

describe('Testando rota de listagem de usuários de um curso', () => {
	let tokenAdmin: string
	let tokenNotAdmin: string
	let userNotAdmin: TUser
	let userAdmin: TUser
	let courseHTML: TCourse

	beforeAll(async () => {
		await client.connect()
		await configureTestDatabase(client)
		const users = await createUsersData(client)
		const token = await createTokenData(client)
		const couse = await createCoursesData(client)
		tokenAdmin = token.tokenAdmin
		tokenNotAdmin = token.tokenNotAdmin
		userAdmin = users.admin
		userNotAdmin = users.notAdmin
		courseHTML = couse.HTMLCourse
	})

	afterAll(async () => {
		await client.end()
	})

	it('GET /courses/:id/users - Sucesso: Listando cursos do usuário com token de admin.', async () => {
		const response = await supertest(app)
			.get(`/courses/${courseHTML.id}/users`)
			.set('Authorization', `Bearer ${tokenAdmin}`)

		expect(response.status).toBe(200)
		expect(Array.isArray(response.body)).toBe(true)
		expect(response.body[0]).toHaveProperty('userId')
		expect(response.body[0]).toHaveProperty('userName')
		expect(response.body[0]).toHaveProperty('courseId')
		expect(response.body[0]).toHaveProperty('courseName')
		expect(response.body[0]).toHaveProperty('courseDescription')
		expect(response.body[0]).toHaveProperty('userActiveInCourse')
	})

	it('GET /courses/:id/users - Erro: Listando cursos do usuário com token de não admin.', async () => {
		const response = await supertest(app)
			.get(`/courses/${courseHTML.id}/users`)
			.set('Authorization', `Bearer ${tokenNotAdmin}`)

		expect(response.status).toBe(403)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('Insufficient permission')
	})

	it('GET /courses/:id/users - Erro: Listandos todos os cursos sem enviar token.', async () => {
		const response = await supertest(app).get(`/courses/${courseHTML.id}/users`)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('Missing bearer token')
	})

	it('GET /courses/:id/users - Erro: Listandos todos os cursos enviando token errado.', async () => {
		const response = await supertest(app)
			.get('/users')
			.set('Authorization', `Bearer 1234`)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message')
	})
})
