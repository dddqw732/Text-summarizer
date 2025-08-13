/** @type {import('jest').Config} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.ts'],
	moduleNameMapper: {
		'^(.*)\\.(css|less|scss)$': '<rootDir>/test/styleMock.js'
	},
	setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts']
};

