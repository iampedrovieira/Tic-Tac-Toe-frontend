/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 0.8 * 60 * 1000 //Time to wait for end of test, after this time throw a erro if dont execute done funtion
};