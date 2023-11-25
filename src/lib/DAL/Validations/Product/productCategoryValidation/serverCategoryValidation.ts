import { CategoryModel } from "../../../Models/index.ts"

async function serverCategoryValidation(name: string) {
	if (await CategoryModel.exists({ name })) return true
}

const productCategoryNameValidators = [
	{
		validator: async (name: string) => {
			if (!(await serverCategoryValidation(name))) return false
			return true
		},
		msg: "Category does not exists!",
	},
]

export default productCategoryNameValidators
