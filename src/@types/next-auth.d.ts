import { DefaultSession, DefaultUser } from "next-auth"
import NextAuth from "next-auth"
import { User as ModelUser } from "../src/lib/DAL/Models"

declare module "next-auth" {
	interface User extends Omit<DefaultUser, "email"> {
		id: number
		name: string
		role: string
		image: string
	}
	interface Session extends DefaultSession {
		user?: User
	}
}
