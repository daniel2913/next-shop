import { UserModel } from "@/lib/DAL/Models"
import authUser from "@/lib/DAL/controllers/userController/authUser"
import dbConnect from "@/lib/dbConnect"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { cache } from "react"

async function findUserByName(name: string) {
	await dbConnect()
	return UserModel.findOne({ name })
}
const getUser = cache((name: string) => findUserByName(name))

export const authOptions: AuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				name: {
					label: "Username",
					type: "text",
					placeholder: "jsmith",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				const user = await authUser(credentials)
				if (user) {
					return user
				}
				return null
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			await dbConnect()
			if (!session.user?.name) return null
			const user = await getUser(session.user.name)
			console.log("user session: ", user)
			if (!user) return session
			session.user.role = user.user.role || "user"
			return session
		},
	},
	session: {
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},
	secret: "FsLlSA0KpXaM7sHNlqrgpO9SlZBsR0/33ndqledspqQ=",
	pages: {
		newUser: "/shop",
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
