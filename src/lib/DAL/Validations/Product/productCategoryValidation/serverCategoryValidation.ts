import { CategoryModel } from '../../../MongoModels/index.ts'

async function serverCategoryValidation(id: string) {
    if (await CategoryModel.exists({ id })) return false
    return 'Category does not exists!'
}

const productCategoryNameValidators = [
    {
        validator: async (id: string) => {
            const error = await serverCategoryValidation(id)
            if (error) return false
            return true
        },
        msg: 'Category does not exists!',
    },
]

export default productCategoryNameValidators
