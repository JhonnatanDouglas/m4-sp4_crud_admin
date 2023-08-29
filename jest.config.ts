/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/integrations/**/*.[jt]s?(x)"],
  testTimeout: 15000,
  verbose: true,
};
