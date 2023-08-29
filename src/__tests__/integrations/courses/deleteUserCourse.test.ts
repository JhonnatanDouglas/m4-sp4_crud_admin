import supertest from 'supertest'
import app from '../../../app'
import { configureTestDatabase } from '../../configs/configTestsDatabase'
import { client } from '../../../database'
import {
	createOnlyCoursesData,
	createTokenData,
	createUsersData,
} from '../../configs/loadData'
import { TCourse, TUser } from '../../mocks/interfaces'

describe('Testando rota de desativação da matricula de usuário em um curso', () => {
	let tokenAdmin: string
	let tokenNotAdmin: string
	let userNotAdmin: TUser
	let userAdmin: TUser
	let couseHTML: TCourse
	let couseNode: TCourse

	beforeAll(async () => {
		await client.connect()
		await configureTestDatabase(client)
		const users = await createUsersData(client)
		const courses = await createOnlyCoursesData(client)
		const token = await createTokenData(client)
		tokenAdmin = token.tokenAdmin
		tokenNotAdmin = token.tokenNotAdmin
		userNotAdmin = users.notAdmin
		userAdmin = users.admin
		couseHTML = courses.HTMLCourse
		couseNode = courses.nodeCourse
	})

	afterAll(async () => {
		await client.end()
	})

	it('DELETE /courses/:courseId/users/:userId - Sucesso: Vinculando um usuário com um curso passando token de admin.', async () => {
		const response = await supertest(app)
			.delete(`/courses/${couseHTML.id}/users/${userAdmin.id}`)
			.set('Authorization', `Bearer ${tokenAdmin}`)

		expect(response.status).toBe(204)
	})

	it('DELETE /courses/:courseId/users/:userId - Error: Vinculando user a um curso que não existe', async () => {
		const response = await supertest(app)
			.delete(`/courses/${userAdmin.id}/users/10`)
			.set('Authorization', `Bearer ${tokenAdmin}`)

		expect(response.status).toBe(404)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('User/course not found')
	})

	it('DELETE /courses/:courseId/users/:userId - Erro: Cadastrando curso com o token de não admin.', async () => {
		const response = await supertest(app)
			.delete(`/courses/${couseHTML.id}/users/${userAdmin.id}`)
			.set('Authorization', `Bearer ${tokenNotAdmin}`)

		expect(response.status).toBe(403)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('Insufficient permission')
	})

	it('DELETE /courses/:courseId/users/:userId - Erro: Cadastrando curso sem enviar token.', async () => {
		const response = await supertest(app).delete(
			`/courses/${couseHTML.id}/users/${userAdmin.id}`
		)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message')
		expect(response.body.message).toBe('Missing bearer token')
	})

	it('DELETE /courses/:courseId/users/:userId - Erro: Cadastrando curso enviando token errado.', async () => {
		const response = await supertest(app)
			.delete(`/courses/${couseHTML.id}/users/${userAdmin.id}`)
			.set('Authorization', `Bearer 1234`)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message')
	})
})
