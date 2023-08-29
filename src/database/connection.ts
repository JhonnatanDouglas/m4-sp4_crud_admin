import client from "./config";

const startDatabase = async (): Promise<void> => {
  await client.connect();
  console.log("Database started.");
};

export default startDatabase;
