import {Config} from "jest"

const config:Config = {
	setupFiles:[
	"<rootDir>/src/tests/setEnvVars.ts"
	],
	moduleNameMapper:{
		"^@/(.*)$":"<rootDir>/src/$1"
	},
	roots:["<rootDir>/src"]
}

export default config
