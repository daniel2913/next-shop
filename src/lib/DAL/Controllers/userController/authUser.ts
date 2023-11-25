import { createHash } from "crypto"
import { UserModel } from "../../Models"
import { User } from "next-auth"

type props = Record<"name" | "password", string> | undefined

export default async function authUser(props: props) {
	const password = props?.password
	const name = props?.name
	if (!password || !name) return null
	const hash = createHash("sha256")
	hash.update(password)
	hash.update(name)
	const passwordHash = hash.digest("base64")
	console.log(passwordHash)
	const user = await UserModel.findOne({ name })
	if (!user) return null
	if (user?.passwordHash === passwordHash) {
		return {
			id: user._id.toString(),
			name: user.name,
			profilepic: user.image,
			role: user.role || "user",
		}
	}
	return null
}
