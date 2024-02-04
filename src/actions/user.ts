"use server"
import { createHash } from "node:crypto"
import { UserModel } from "@/lib/DAL/Models"
import { validateLogin, validatePassword } from "@/helpers/validation"
import { ServerError } from "./common"
import { headers } from "next/headers"

export async function registerUserAction(username: string, password: string) {
	try{
	const props: { [key: string]: unknown } = {}
	const hash = createHash("sha256")
	const invalid = validateLogin(username) || validatePassword(password)
	if (invalid) throw new ServerError(invalid,"Validation Error")
	hash.update(password)
	hash.update(username)
	props.passwordHash = hash.digest("hex")
	props.role = "user"
	props.name = username
	const res =  await UserModel.create(props)
	if (!res){
		throw ServerError.unknown()
	}
	}
	catch(error){
		return ServerError.fromError(error).emmit()
	}
}
