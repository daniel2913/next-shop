import { UserCache } from "@/helpers/cachedGeters"
import authUser from "@/lib/DAL/controllers/userController/authUser"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
			async authorize(credentials) {
				const user = await authUser(credentials)
				if (user) {
					return user
				}
				return null
			},
		}),
	],
	callbacks: {
		async session({ session }) {
			if (!session.user?.name) return session
			const { cart, votes, passwordHash, ...user } =
				await UserCache.get(session.user.name)
			if (!user) return session
			session.user = user
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
