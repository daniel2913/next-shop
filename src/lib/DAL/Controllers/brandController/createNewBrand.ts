import dbConnect from '@/lib/dbConnect.ts'
import { newDocument, isMongoError, noFunc } from '../../helpers.ts'
import { Brand, BrandModel } from '../../MongoModels/index.ts'

export default async function createNewBrand({
    ...args
}: noFunc<Brand> & { imageName?: string }) {
    const newBrand = newDocument(Brand, { ...args })
    console.log(args)
    await dbConnect()
    let err = null
    try {
        await newBrand.validate()
    } catch (error) {
        err = isMongoError(error)
            ? error.message
            : 'Some error occured during validation'
    }
    if (err) return err

    let brand = null
    try {
        brand = await newBrand.save()
    } catch (error) {
        err = error
    }
    return !brand ? 'Connection Error' : 'Brand created successfuly'
}
