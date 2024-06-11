/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		"@/(.*)": "<rootDir>/src/$1",
		"@public/(.*)": "<rootDir>/public/$1",
	},
	globals: {
		"ts-jest": {
			diagnostics: false
		}
	},
};
