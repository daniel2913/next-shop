import type { User } from "@/lib/Models";
import { ServerError } from "../common";

export class GlobalTestAuth {
	static inst: GlobalTestAuth
	public user: User | null = null
	constuctor() {
		if (GlobalTestAuth.inst) return GlobalTestAuth.inst
		GlobalTestAuth.inst = this
	}
}

global.auth = new GlobalTestAuth()

export function auth(role?: string){
	const globalAuth = global.auth
	if (!globalAuth.user) throw ServerError.notAuthed()
	if (role && globalAuth.user.role !== role) throw ServerError.notAllowed()
	return globalAuth.user
}
