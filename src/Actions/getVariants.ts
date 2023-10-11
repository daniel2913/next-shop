'use server'
import { BrandModel, CategoryModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'

interface variant {
    name: string
    id: string
}

export async function getVariants(type: string) {
    'use server'
    await dbConnect()
    const variants: variant[] = (
        await (type === 'category'
            ? CategoryModel.find().exec()
            : BrandModel.find().exec()
        )
    ).map((variant) => ({ name: variant.name, id: variant._id.toString() }))
    return variants
}
