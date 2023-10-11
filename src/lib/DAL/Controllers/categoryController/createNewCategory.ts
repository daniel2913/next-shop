import { newDocument, isMongoError, noFunc } from '../../helpers.ts'
import { Category } from '../../MongoModels/index.ts'

export default async function createNewBrand({
    ...args
}: noFunc<Category> & { imageName?: string }) {
    const newCategory = newDocument(Category, { ...args })

    let err = null
    try {
        await newCategory.validate()
    } catch (error) {
        err = isMongoError(error)
            ? error.message
            : 'Some error occured during validation'
    }
    if (err) return err

    let category = null
    try {
        category = await newCategory.save()
    } catch (error) {
        err = error
    }
    return !category ? 'Connection Error' : 'Category created successfuly'
}
