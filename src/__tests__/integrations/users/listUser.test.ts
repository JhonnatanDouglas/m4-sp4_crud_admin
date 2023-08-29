import supertest from "supertest";
import app from "../../../app";
import { client } from "../../../database";
import { configureTestDatabase } from "../../configs/configTestsDatabase";
import { createTokenData, createUsersData } from "../../configs/loadData";

describe("Testando rota de listagem de usuários", () => {
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

  it("GET /users - Sucesso: Listandos todos os usuários com o token de admin.", async () => {
    const response = await supertest(app)
      .get("/users")
      .set("Authorization", `Bearer ${tokenAdmin}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).not.toHaveProperty("password");
  });

  it("GET /users - Erro: Listandos todos os usuários com o token de não admin.", async () => {
    const response = await supertest(app)
      .get("/users")
      .set("Authorization", `Bearer ${tokenNotAdmin}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Insufficient permission");
  });

  it("GET /users - Erro: Listandos todos os usuários sem enviar token.", async () => {
    const response = await supertest(app).get("/users");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Missing bearer token");
  });

  it("GET /users - Erro: Listandos todos os usuários enviando token errado.", async () => {
    const response = await supertest(app)
      .get("/users")
      .set("Authorization", `Bearer 1234`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
