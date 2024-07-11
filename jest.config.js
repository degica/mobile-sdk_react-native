/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  // added dist file to ignore
  testPathIgnorePatterns: ["<rootDir>/dist"],
  setupFiles: ["<rootDir>/setupTests.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }),
};
