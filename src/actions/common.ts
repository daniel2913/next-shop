import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { PgreModel } from "@/lib/Models/base";
import { getServerSession } from "next-auth";
import type { PostgresError } from "postgres";
import { ZodError } from "zod";
import { UserCache } from "@/helpers/cache";

export async function auth(role?: string) {
	const res = await getServerSession(authOptions);
	if (!res?.user) throw ServerError.notAuthed();
	if (role && res.user.role !== role) throw ServerError.notAllowed();
	const user = await UserCache.get(res.user.name);
	if (!user) throw ServerError.unknown("Error in UserCache");

	return user;
}

export async function modelGeneralAction(
	model: PgreModel<any, any>,
	formOrProps: FormData | Record<string, unknown>,
	id?: number,
) {
	const session = await getServerSession(authOptions);
	if (session?.user?.role !== "admin") return ServerError.notAllowed().emmit();

	return modelGeneralActionNoAuth(model, formOrProps, id);
}
export async function modelGeneralActionNoAuth(
	model: PgreModel<any, any>,
	formOrProps: FormData | Record<string, unknown>,
	id?: number,
) {
	try {
		const props =
			formOrProps instanceof FormData
				? parseFormData(formOrProps)
				: formOrProps;
		const res =
			id !== undefined
				? await model.patch(id, props)
				: await model.create(props);
		if (!res) {
			throw id ? ServerError.notFound() : ServerError.unknown();
		}
		return false;
	} catch (error) {
		return ServerError.fromError(error).emmit();
	}
}

function isPgError(obj: unknown): obj is PostgresError {
	if (
		obj &&
		typeof obj === "object" &&
		"severity" in obj &&
		"schema_name" in obj &&
		"table_name" in obj
	)
		return true;
	return false;
}

export class ServerError extends Error {
	public publicError: string;
	public error: unknown;
	public title: string;
	constructor(error: string, title = "Server Error") {
		super()
		this.publicError = error;
		this.title = title;
	}
	static notAuthed(desc?: string, title?: string) {
		return new ServerError(
			desc ?? "You need to authenticate to perform this action",
			title ?? "Not Authenticated",
		);
	}
	static notAllowed(desc?: string, title?: string) {
		return new ServerError(
			desc ?? "Your role does not allow this action",
			title ?? "Not Authorized",
		);
	}
	static notFound(desc?: string, title?: string) {
		return new ServerError(
			desc ?? "Requested item is not found",
			title ?? "Not Found",
		);
	}
	static unknown(desc?: string, title?: string) {
		//console.trace(desc);
		return new ServerError(desc ?? "Unknown error", title ?? "Unknown Error");
	}
	static invalid(desc?: string, title?: string) {
		return new ServerError(
			desc ?? "Provided input is not valid",
			title ?? "Validation Error",
		);
	}
	static internal(message: string) {
		const res = new ServerError("Internal error", "Server Error");
		res.error = message;
		res.log();
		return new ServerError("Internal error", "Server Error");
	}

	static fromError(error: unknown) {
		if (error instanceof ZodError) {
			const err = new ServerError(
				error.issues
					.map((issue) => `${issue.path}: ${issue.message}`)
					.join("\n"),
				"Validation Error",
			);
			err.error = error;
			return err;
		}
		if (isPgError(error)) {
			const err = new ServerError(error.message, "Database error");
			err.error = error;
			return err;
		}
		if (error instanceof ServerError) return error;
		const err = ServerError.unknown()
		err.error = error;
		console.error(err);
		return err;
	}
	public emmit() {
		return { error: this.publicError, title: this.title };
	}
	public log() {
		console.error(this.title, this.publicError, this.error);
	}
}

export function parseFormData(formData: FormData) {
	const object: Record<string, unknown> = {};
	for (const [key, value] of formData.entries()) {
		if (value instanceof File && value.size === 0) continue;
		if (key in object) {
			if (Array.isArray(object[key])) (object[key] as unknown[]).push(value);
			else object[key] = [object[key], value];
		} else object[key] = value;
	}
	return object;
}
