import dbConnect from '@/lib/dbConnect'
import { NextResponse } from 'next/server'
import { Tconfig } from '.'
import { ReturnModelType } from '@typegoose/typegoose'
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types'

type Tquery = { [i: string]: string | undefined }

export default async function getController<T extends AnyParamConstructor<any>>(
    querys: Tquery,
    config: Tconfig<T>
) {
    const { model } = config

    await dbConnect()
    try {
        const query: any = {}
        for (const [key, value] of Object.entries(querys)) {
            if (value) {
                query[key] = value
            }
        }
        const res = await model.find(query).lean().exec()

        return NextResponse.json(res ? res : [], {
            status: res?.length === 0 ? 404 : 200,
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json('Server error', {
            status: 500,
        })
    }
}
