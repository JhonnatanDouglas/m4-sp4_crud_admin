import supertest from "supertest";
import app from "../../../app";
import { configureTestDatabase } from "../../configs/configTestsDatabase";
import { client } from "../../../database";
import { createTokenData, createUsersData } from "../../configs/loadData";
import { createHTMLCourse } from "../../mocks/courses/couses.mockes";

describe("Testando rota de criação de curso", () => {
  let tokenAdmin: string;
  let tokenNotAdmin: string;

  beforeAll(async () => {
    await client.connect();
    await configureTestDatabase(client);
    await createUsersData(client);
    const token = await createTokenData(client);
    tokenAdmin = token.tokenAdmin;
    tokenNotAdmin = token.tokenNotAdmin;
  });

  afterAll(async () => {
    await client.end();
  });

  it("POST /courses - Sucesso: Criando um curso com sucesso passando token de admin.", async () => {
    const response = await supertest(app)
      .post("/courses")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send(createHTMLCourse);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
  });

  it("POST /courses - Error: Criando um course com keys erradas no body da request.", async () => {
    const response = await supertest(app)
      .post("/courses")
      .set("Authorization", `Bearer ${tokenAdmin}`)
      .send({ description: 1234 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("description");
  });

  it("POST /courses - Erro: Cadastrando curso com o token de não admin.", async () => {
    const response = await supertest(app)
      .post("/courses")
      .set("Authorization", `Bearer ${tokenNotAdmin}`)
      .send(createHTMLCourse);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Insufficient permission");
  });

  it("POST /courses - Erro: Cadastrando curso sem enviar token.", async () => {
    const response = await supertest(app)
      .post("/courses")
      .send(createHTMLCourse);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Missing bearer token");
  });

  it("POST /courses - Erro: Cadastrando curso enviando token errado.", async () => {
    const response = await supertest(app)
      .post("/courses")
      .set("Authorization", `Bearer 1234`)
      .send(createHTMLCourse);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
