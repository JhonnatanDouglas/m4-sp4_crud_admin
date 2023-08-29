import supertest from "supertest";
import app from "../../../app";
import { configureTestDatabase } from "../../configs/configTestsDatabase";
import { client } from "../../../database";
import {
  createUserAdmin,
  createUserNotAdmin,
  createUserWrongKeys,
} from "../../mocks/users/users.mocks";

describe("Testando rota de criação de usuário", () => {
  beforeAll(async () => {
    await client.connect();
    await configureTestDatabase(client);
  });

  afterAll(async () => {
    await client.end();
  });

  it("POST /users - Sucesso: Criando um usuário admin com sucesso.", async () => {
    const response = await supertest(app).post("/users").send(createUserAdmin);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("admin");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body.admin).toEqual(createUserAdmin.admin);
  });

  it("POST /users - Sucesso: Criando um usuário não admin com sucesso.", async () => {
    const response = await supertest(app)
      .post("/users")
      .send(createUserNotAdmin);

    expect(response.status).toBe(201);
    expect(response.body).toMatch;
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("admin");
    expect(response.body).not.toHaveProperty("password");
    expect(response.body.admin).toEqual(createUserNotAdmin.admin);
  });

  it("POST /users - Error: Criando um usuário com email que já existe.", async () => {
    const response = await supertest(app)
      .post("/users")
      .send(createUserNotAdmin);

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toBe("Email already registered");
  });

  it("POST /users - Error: Criando um usuário com keys erradas no body da request.", async () => {
    const response = await supertest(app)
      .post("/users")
      .send(createUserWrongKeys);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("password");
  });
});
