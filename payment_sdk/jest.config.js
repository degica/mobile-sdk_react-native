module.exports = {
  preset: "react-native",
  testEnvironment: "node",
  modulePathIgnorePatterns: ["<rootDir>/node_modules"],
  setupFiles: ["<rootDir>/setupTests.js"],
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [],
};
