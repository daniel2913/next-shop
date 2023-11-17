import dbConnect from '@/lib/dbConnect'
import { Brand, BrandModel } from '../../Models'
import { NextResponse } from 'next/server'
import {
    Image,
    deleteImages,
    handleImages,
    saveImages,
} from '../../../../helpers/images'
import { Tconfig, form, imagesDiff, isValidDocument } from '.'
import { FilterQuery } from 'mongoose'

export default async function patchController<
    T
>({ targId, targName, ...props }: any, config: Tconfig<T>) {
    const { DIR_PATH, model, multImages } = config

    await dbConnect()

    if (!targId && !targName)
        return new NextResponse('Invalid target', { status: 400 })
    const query: FilterQuery<T> = targId ? { _id: targId } : { name: targName }

    const cur = await model.findOne(query)
    if (!cur || false ) {				//!isDocument(cur)
        return new NextResponse('Not Found', { status: 404 })
    }

    let newImages: Image[] = []
    const imagesPath = config.multImages ? 'images' : 'image'
    const oldImages = config.multImages
        ? (cur[imagesPath] as string[])
        : ([cur[imagesPath]] as string[])
    ////console.log(props)
    ////console.log('old images: ', oldImages)

    props['delImages'] = props['delImages'] ? props['delImages'].split(';') : []
    ////console.log(props['delImages'])
    let delImages = props['delImages'].filter((strNum: string) => {
        return !Number.isNaN(+strNum) && +strNum < oldImages.length
    })
    ////console.log(delImages)
    if (props[imagesPath] && props[imagesPath].length > 0) {
        ////console.log(props[imagesPath])
        newImages = handleImages(props[imagesPath])
    }
    props[imagesPath] = imagesDiff(
        newImages.map((image) => image.name),
        config,
        oldImages,
        delImages
    )
    ////console.log(delImages)

    ////console.log('new images:', newImages)

    ////console.log('del images: ', delImages)

    ////console.log('prop images pre: ', props[imagesPath])
    if (!multImages) {
        if (props[imagesPath].length > 1 || !props[imagesPath]) {
            return new NextResponse('Too much single image!', { status: 500 })
        }
        props[imagesPath] = props[imagesPath][0]
            ? props[imagesPath][0]
            : 'template.jpeg'
    } else {
        props[imagesPath] = props[imagesPath][0]
            ? props[imagesPath]
            : ['template.jpeg']
    }
    ////console.log(delImages)
    delImages = delImages.map((idx: string) => oldImages[+idx])
    ////console.log(delImages)

    if (!multImages && newImages.length > 0) {
        delImages = oldImages
    }

    ////console.log('prop images post: ', props[imagesPath])
    for (const i in cur.schema.paths as any as [keyof typeof cur]) {
        if (i in props && i in cur && i != '_id' && props[i]) {
            cur[i] = props[i]
        }
    }

    const validDocument = await isValidDocument<T>(cur)
    if (!validDocument) {
        return new NextResponse('Invalid props', { status: 400 })
    }
    try {
        if (!(await saveImages(newImages, DIR_PATH))) {
            return new NextResponse('Couldnt save', { status: 500 })
        }
    } catch (error) {
        return new NextResponse('Errored on save', { status: 500 })
    }
    const stat = await validDocument	//.save()
    deleteImages(delImages, DIR_PATH)
    return NextResponse.json(stat)
}
