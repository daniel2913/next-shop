import { UserCache } from "@/helpers/cache";
import { env } from "node:process";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authUser } from "@/actions/user";
import { revalidatePath } from "next/cache";


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
				if (!credentials) return null
				const res = await authUser(credentials);
				if (res) {
					revalidatePath("/shop/cart");
					revalidatePath("/shop/orders");
				}
				return res
			},
		}),
	],
	callbacks: {
		async session({ session }) {
			if (!session.user?.name) return session;
			const user = await UserCache.get(session.user.name);
			if (!user) return session;
			session.user = {
				id: user.id,
				role: user.role,
				name: user.name,
			};
			return session;
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
