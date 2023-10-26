import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'
import { BrandModel } from '../../MongoModels'

type Tquery = { id?: string; name?: string }

export default async function getBrands({ id, name }: Tquery) {
    await dbConnect()
    console.log(BrandModel.schema.paths)
    try {
        const query = BrandModel.find()
        if (id) {
            query.findOne({ _id: id })
        } else if (name) {
            query.find({ name })
        }
        const brands = await query.lean().exec()

        return NextResponse.json(brands ? brands : [], {
            status: brands?.length === 0 ? 204 : 200,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json('Server error', {
            status: 500,
        })
    }
}
