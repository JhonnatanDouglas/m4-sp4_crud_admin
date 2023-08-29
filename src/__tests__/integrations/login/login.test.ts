import supertest from "supertest";
import app from "../../../app";
import { configureTestDatabase } from "../../configs/configTestsDatabase";
import { client } from "../../../database";
import {
  userNotAdminLogin,
  userWrongEmailLogin,
  userWrongKeysLogin,
  userWrongPasswordLogin,
} from "../../mocks/login/login.mocks";
import { createUsersData } from "../../configs/loadData";

describe("Testando rota de login", () => {
  beforeAll(async () => {
    await client.connect();
    await configureTestDatabase(client);
    await createUsersData(client);
  });

  afterAll(async () => {
    await client.end();
  });

  it("POST /login - Sucesso: Fazendo login com usuário ativo.", async () => {
    const response = await supertest(app)
      .post("/login")
      .send(userNotAdminLogin);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("POST /login - Error: Fazendo login com senha incorreta.", async () => {
    const response = await supertest(app)
      .post("/login")
      .send(userWrongPasswordLogin);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Wrong email/password");
  });

  it("POST /login - Error: Fazendo login com email incorreto.", async () => {
    const response = await supertest(app)
      .post("/login")
      .send(userWrongEmailLogin);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Wrong email/password");
  });

  it("POST /login - Error: Fazendo login com keys incorretas.", async () => {
    const response = await supertest(app)
      .post("/login")
      .send(userWrongKeysLogin);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("password");
  });
});
