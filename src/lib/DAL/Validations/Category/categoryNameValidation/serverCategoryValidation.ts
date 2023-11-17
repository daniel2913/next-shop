import { CategoryModel } from '../../../Models/index.ts'

async function serverCategoryValidation(name: string) {
    if (await CategoryModel.exists({ name })) return 'mCategory already exists!'
    return false
}

const categoryNameValidators = [
    {
        validator: async (name: string) => {
            const error = await serverCategoryValidation(name)
            if (error) return false
            return true
        },
        msg: 'Category already exists!',
    },
]

export default categoryNameValidators
