import { Product } from '../../MongoModels/index.ts'
import { newDocument, noFunc } from '../../helpers.ts'

export default async function createNewProduct(
    args: noFunc<Product> & { imageNames?: string[] }
) {
    const newProduct = newDocument(Product, { ...args })
    let err = null
    try {
        await newProduct.validate()
    } catch (error) {
        err = error
    }
    if (err) throw err
    let res = null
    try {
        res = await newProduct.save()
    } catch (error) {
        err = error
    }
    if (err) throw err
    return err ? err : res
}
