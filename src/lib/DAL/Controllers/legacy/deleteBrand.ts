import dbConnect from '@/lib/dbConnect'
import { BrandModel } from '../../MongoModels'
import { NextResponse } from 'next/server'
import { deleteImages } from '../../../../helpers/images'

const DIR_PATH = './public/brands/'

export default async function deleteBrand({
    id,
    name,
}: {
    id?: string
    name?: string
}) {
    await dbConnect()
    const query = BrandModel.find()
    if (id) {
        query.findOne({ _id: id })
    } else if (name) {
        query.findOne({ name: name })
    } else {
        return new NextResponse('Invalid request', { status: 400 })
    }
    const res = await query.exec()
    const brand = res as unknown as (typeof res)[0]
    if (!res) {
        return new NextResponse('Not Found', { status: 404 })
    }
    deleteImages([brand.image], DIR_PATH)
    const stat = brand.deleteOne()
    return NextResponse.json(stat)
}
