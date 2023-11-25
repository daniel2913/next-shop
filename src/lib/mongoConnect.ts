import mongoose from "mongoose"

const MONGODB_URL =
	process.env.DEV !== "PROD"
		? process.env.MONGO_URL_DEV
		: process.env.MONGO_URL_PROD

if (!MONGODB_URL) {
	throw new Error(
		"Define the MONGODB_URL environment variable inside .env.local",
	)
}

let cached = global.mongoose

if (!cached) {
	cached = global.mongoose = { conn: null, promise: null }
}

async function mongoConnect() {
	if (process.env.DB !== "MONGO") return true
	if (cached.conn) {
		return cached.conn
	}

	if (!cached.promise) {
		const opts = {
			bufferCommands: true,
		}
		if (!MONGODB_URL) throw "Error"
		console.log("Connecting...")
		cached.promise = mongoose.connect(MONGODB_URL, opts).then((mongoose) => {
			console.log("WE ARE CONNECTED")
			return mongoose
		})
	}

	try {
		cached.conn = await cached.promise
	} catch (e) {
		cached.promise = null
		throw e
	}

	return cached.conn
}

export default mongoConnect
