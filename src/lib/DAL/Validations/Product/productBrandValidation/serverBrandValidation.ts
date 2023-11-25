import { BrandModel } from "../../../Models/index.ts"

async function serverBrandNameValidation(name: string) {
	if (await BrandModel.exists({ name })) return false
	return "Brand does not exists!"
}

const productBrandNameValidators = [
	{
		validator: async (name: string) => {
			if (await serverBrandNameValidation(name)) return false
			return true
		},
		msg: "Brand does not exists!",
	},
]

export default productBrandNameValidators
