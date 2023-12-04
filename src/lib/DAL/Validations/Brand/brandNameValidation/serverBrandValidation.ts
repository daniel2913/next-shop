import { BrandModel } from "../../../Models/index.ts"

async function serverBrandValidation(name: string) {
	if (await BrandModel.exists({ name }))
		return "Brand already exists!"
	return false
}

const brandNameValidators = [
	{
		validator: async (login: string) => {
			const error = await serverBrandValidation(login)
			if (error) return false
			return true
		},
		msg: "Brand already exists!",
	},
]

export default brandNameValidators
