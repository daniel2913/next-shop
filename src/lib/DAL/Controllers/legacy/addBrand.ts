import dbConnect from '@/lib/dbConnect.ts'
import { BrandModel } from '../../MongoModels/index.ts'
import { deleteImages, handleImages, saveImages } from '@/helpers/images.ts'
import { NextResponse } from 'next/server'

const DIR_PATH = './public/brands/'

export default async function addBrand(props: {
    [a: string]: string | undefined | File
}) {
    const image = handleImages([props['image']])?.[0] || null
    if (!image) {
        return new NextResponse('Validation error', { status: 400 })
    }
    props.image = image.name

    await dbConnect()
    const newBrand = new BrandModel(props)

    try {
        await newBrand.validate()
    } catch (error) {
        console.error(error)
        return new NextResponse('Validation error', { status: 400 })
    }

    if (image.file && !(await saveImages([image], DIR_PATH))) {
        return new NextResponse('Server error', { status: 500 })
    }

    try {
        const res = await newBrand.save()
        if (!res) {
            deleteImages([image.name], DIR_PATH)
            throw 'Could not save images'
        }
        return NextResponse.json(res, { status: 201 })
    } catch (error) {
        console.error(error)
        return new NextResponse('DB error', { status: 500 })
    }
}
