import { Client } from "pg";
import "dotenv/config";
import fs from "fs";

const deleteTables = async (database: Client): Promise<void> => {
  const query: string = `
        DROP TABLE IF EXISTS
            "users",
            "courses",
            "userCourses"
        CASCADE;
    `;
  await database.query(query).catch((err: any) =>
    console.error({
      message: `Aconteceu um erro ${err.code}. Verifique se o nome da sua tabela e as colunas estão de acordo com o solicitado na descrição da entrega.`,
      error: err.message,
    })
  );
};

const createTables = async (database: Client) => {
  const sql = fs.readFileSync("sql/createTables.sql").toString();
  await database.query(sql).catch((err: any) =>
    console.error({
      message: `Aconteceu um erro ${err.code}. Verifique se as querys de criação das tabelas em 'sql/createTables.sql' estão funcionais. E se o nome da sua tabela e colunas estão de acordo com o solicitado na descrição da entrega`,
      error: err.message,
    })
  );
};

const configureTestDatabase = async (database: Client) => {
  await deleteTables(database);
  await createTables(database);
};

export { configureTestDatabase };
