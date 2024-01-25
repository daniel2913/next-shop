import { createHash } from "node:crypto"
import { modelGeneralAction} from "./common"

import { UserModel } from "@/lib/DAL/Models"
import { validateLogin, validatePassword } from "@/helpers/validation"



export async function registerUserAction(username: string, password: string) {
	const props: { [key: string]: unknown } = {}
	const hash = createHash("sha256")
	const invalid = validateLogin(username) || validatePassword(password)
	if (invalid) return invalid
	hash.update(password)
	hash.update(username)
	props.passwordHash = hash.digest("hex")
	props.role = "user"
	props.name = username
	modelGeneralAction(UserModel, props)
}
