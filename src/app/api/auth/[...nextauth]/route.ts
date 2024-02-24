import { UserCache } from "@/helpers/cache"
import { env } from "process"
import { UserModel } from "@/lib/Models"
import { createHash } from "crypto"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { revalidatePath } from "next/cache"

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
	const user = await UserModel.findOne({ name: props.name })
	if (!user) return null
	if (user.passwordHash === passwordHash) {
		revalidatePath("/shop/cart")
		revalidatePath("/shop/orders")
		return {
			id: user.id,
			name: user.name,
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
			const fullUser = await UserCache.get(session.user.name)
			if (!fullUser) return session
			session.user = {
				id: fullUser.id,
				role: fullUser.role,
				name: fullUser.name,
			}
			return session
		},
	},
	session: {
		maxAge: 30 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},
	secret: env.NEXTAUTH_SECRET,
	pages: {
		newUser: "/shop/home",
	},
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
