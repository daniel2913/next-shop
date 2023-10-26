import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'
import { deleteImages } from '../../../../helpers/images'
import { Tconfig } from '.'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'
import { isDocument } from '@typegoose/typegoose'
import { FilterQuery } from 'mongoose'

export default async function deleteController<
    T extends AnyParamConstructor<any>
>(
    {
        _id,
        name,
    }: {
        _id?: string
        name?: string
    },
    config: Tconfig<T>
) {
    await dbConnect()
    const { model, multImages, DIR_PATH } = config
    if (!_id && !name) {
        return new NextResponse('Invalid request', { status: 400 })
    }
    const query: FilterQuery<T> = _id ? { _id } : { name }

    const res = await model.findOne(query).exec()
    if (!res || !isDocument(res)) {
        return new NextResponse('Not Found', { status: 404 })
    }
    if ('image' in res || 'images' in res) {
        const images = multImages ? res.images : [res.image]
        deleteImages(images, DIR_PATH)
    }

    const stat = await res.deleteOne()
    return NextResponse.json(stat)
}
