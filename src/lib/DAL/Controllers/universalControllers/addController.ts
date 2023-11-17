import dbConnect from '@/lib/dbConnect.ts'
import {
    BrandModel,
    CategoryModel,
    ProductModel,
    UserModel,
} from '../../Models/index.ts'
import { deleteImages, handleImages, saveImages } from '@/helpers/images.ts'
import { NextResponse } from 'next/server'
import { Tconfig, form, isValidDocument } from './index.ts'


export default async function addController<T>(
    props: any,
    config: Tconfig<T>
) {
    const { DIR_PATH, model, multImages } = config

    const imageFiles = ((multImages ? props['images'] : props['image']) || []) as (
        | File
        | string
    )[]

    const images = handleImages(imageFiles)

    if (multImages) {
        props.images = images.map((image) => image.name)
    } else {
        props.image = images[0].name
    }
    console.log(props)
    await dbConnect()
    const unknownDocument = false//new model(props) as unknown

    const newDocument = await isValidDocument<typeof model>(unknownDocument)
    if (!newDocument) {
        return new NextResponse('Validation error', { status: 400 })
    }
	
    if (!(await saveImages(images, DIR_PATH))) {
        return new NextResponse('Server error', { status: 500 })
    }

    try {
        const res = await newDocument//.save()
        if (!res) {
            deleteImages(
                images.map((image) => image.name),
                DIR_PATH
            )
            throw 'Could not save images'
        }
        return NextResponse.json(res, { status: 201 })
    } catch (error) {
        console.error(error)
        return new NextResponse('DB error', { status: 500 })
    }
}
