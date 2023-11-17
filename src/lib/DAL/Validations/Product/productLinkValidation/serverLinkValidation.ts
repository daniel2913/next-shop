import { ProductModel } from '../../../Models/index.ts'

async function serverLinkValidation(link: string) {
    console.log(link)
    //if (await ProductModel.exists({ link })) return false
    return true
}

const productLinkValidators = [
    {
        validator: async (link: string) => {
            if (!(await serverLinkValidation(link))) return false
            return true
        },
        msg: 'Product already exists!',
    },
]

export default productLinkValidators
