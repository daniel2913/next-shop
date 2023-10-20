import dbConnect from '@/lib/dbConnect'
import { Brand, BrandModel } from '../../MongoModels'
import { NextResponse } from 'next/server'
import {
    deleteImages,
    handleImages,
    saveImages,
} from '../../../../helpers/images'

const DIR_PATH = './public/brands/'

export default async function patchBrand({ targId, targName, ...props }: any) {
    await dbConnect()
    const query = BrandModel.find()
    if (targId) {
        query.findOne({ _id: targId })
    } else if (targName) {
        query.findOne({ name: targName })
    } else {
        return new NextResponse('Invalid request', { status: 400 })
    }
    const res = await query.exec()

    const brand = res as unknown as any
    if (!res) {
        return new NextResponse('Not Found', { status: 404 })
    }

    const newImage = handleImages([props.image])?.[0]
    props.image = newImage?.file ? newImage.name : undefined
    const oldImage = brand.image

    for (const i in brand.schema.paths) {
        if (props[i] && i != '_id') {
            brand[i] = props[i]
        }
    }
    try {
        await brand.validate()
    } catch (error) {
        console.error(error)
        return new NextResponse('Invalid request', { status: 400 })
    }
    if (newImage?.file && !(await saveImages([newImage], DIR_PATH))) {
        return new NextResponse('Invalid request', { status: 400 })
    }
    if (props.image) {
        deleteImages([oldImage], DIR_PATH)
    }
    const stat = await brand.save()

    return NextResponse.json(stat)
}
