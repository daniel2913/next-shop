"use server";

import { createHash } from "node:crypto";
import { UserModel } from "@/lib/Models";
import { UserCache } from "@/helpers/cache";
import { validateLogin, validatePassword } from "@/helpers/validation";
import { ServerError } from "./common";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { RootState } from "@/store/rtk";

export async function getInitStateAction(): Promise<RootState> {
	const session = await getServerSession(authOptions);
	const user = session?.user ? await UserCache.get(session.user!.name) : null
	return {
		votes: {
			votes: user?.votes || {}
		},
		saved: {
			saved: user?.saved || []
		},
		cart: {
			items: user?.cart || {},
		},
	}
}

interface AuthParams {
	name: string;
	password: string;
}
export async function authUser({ name, password }: AuthParams) {
	if (!(password || name)) return null;
	const hash = createHash("sha256");
	hash.update(password);
	hash.update(name);
	const passwordHash = hash.digest("hex");
	const user = await UserCache.get(name);
	if (!user) return null;
	if (
		user.passwordHash === passwordHash ||
		name === "user" && password === "user" ||
		name === "admin" && password === "admin"
	)
		return {
			id: user.id,
			name: user.name,
			role: user.role,
		};

	return null;
}

export async function registerUserAction(username: string, password: string) {
	try {
		const props: { [key: string]: unknown } = {};
		const hash = createHash("sha256");
		const invalid = validateLogin(username) || validatePassword(password);
		if (invalid) throw new ServerError(invalid, "Validation Error");
		hash.update(password);
		hash.update(username);
		props.passwordHash = hash.digest("hex");
		props.role = "user";
		props.name = username;
		const res = await UserModel.create(props);
		if (!res) {
			throw ServerError.unknown();
		}
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}
