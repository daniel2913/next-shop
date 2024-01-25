import { UserCache } from "@/helpers/cachedGeters"
import { createHash } from "crypto"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

interface Props {
	name: string
	password: string
}
async function authUser(props: Props | undefined) {
	const password = props?.password
	const name = props?.name
	if (!(password && name)) return null
	const hash = createHash("sha256")
	hash.update(password)
	hash.update(name)
	const passwordHash = hash.digest("hex")
	const user = await UserCache.get(props.name)
	if (!user) return null
	if (user.passwordHash === passwordHash) {
		return {
			id: user.id,
			name: user.name,
			image: user.image,
			role: user.role || "user",
		}
	}
	return null
}


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
			const { cart, votes, passwordHash, ...user } = await UserCache.get(
				session.user.name
			)
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
