import { BrandModel } from '../../../MongoModels/index.ts'

async function serverBrandNameValidation(id: string) {
    if (await BrandModel.exists({ id })) return false
    return 'Brand does not exists!'
}

const productBrandNameValidators = [
    {
        validator: async (id: string) => {
            const error = await serverBrandNameValidation(id)
            if (error) return false
            return true
        },
        msg: 'Brand does not exists!',
    },
]

export default productBrandNameValidators
