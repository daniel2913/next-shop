import { BrandModel } from '../../../MongoModels/index.ts'

async function serverBrandNameValidation(_id: string) {
    if (await BrandModel.exists({ _id })) return false
    return 'Brand does not exists!'
}

const productBrandNameValidators = [
    {
        validator: async (_id: string) => {
            if (await serverBrandNameValidation(_id)) return false
            return true
        },
        msg: 'Brand does not exists!',
    },
]

export default productBrandNameValidators
