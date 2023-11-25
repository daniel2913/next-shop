import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			role: "admin" | "user"
		} & DefaultSession["user"]
	}
	interface User extends DefaultUser {
		role: "admin" | "user"
	}
}
