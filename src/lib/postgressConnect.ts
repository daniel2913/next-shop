import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

const PGRE_URL =
	process.env.ENV === 'DEV'
		? process.env.PGRE_URL_DEV
		: process.env.PGRE_URL_DEV

if (!PGRE_URL) {
	throw 'Define the PGRE_URL environment variable inside .env.local'
}

const pgreConnect = drizzle(postgres(PGRE_URL), { logger: true })

export default pgreConnect
