const { pathsToModuleNameMapper } = require("ts-jest");

const { compilerOptions } = require("./tsconfig.json");

module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/example/node_modules"],
  setupFiles: ["<rootDir>/setupTests.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/src/" }),
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/example/node_modules",
    "<rootDir>/lib/"
  ]
};