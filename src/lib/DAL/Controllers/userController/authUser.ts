import { createHash } from "crypto"
import { UserModel } from "../../Models"

interface Props{
	name?:string
	password?:string
}

export default async function authUser(props: Props|undefined) {
	const password = props?.password
	const name = props?.name
	if (!(password && name)) return null
	const hash = createHash("sha256")
	hash.update(password)
	hash.update(name)
	const passwordHash = hash.digest("hex")
	const user = await UserModel.findOne({ name })
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
