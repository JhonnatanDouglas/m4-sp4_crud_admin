import supertest from "supertest";
import app from "../../../app";
import { configureTestDatabase } from "../../configs/configTestsDatabase";
import { client } from "../../../database";
import { createCoursesData, createUsersData } from "../../configs/loadData";

describe("Testando rota de listagem de cursos", () => {
  beforeAll(async () => {
    await client.connect();
    await configureTestDatabase(client);
    await createUsersData(client);
    await createCoursesData(client);
  });

  afterAll(async () => {
    await client.end();
  });

  it("GET /courses - Sucesso: Listando todos os cursos.", async () => {
    const response = await supertest(app).get("/courses");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
