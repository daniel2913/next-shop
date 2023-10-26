import { NextRequest, NextResponse } from 'next/server'

import { Product, ProductModel } from '@/lib/DAL/MongoModels'
import {
    addController,
    deleteController,
    getController,
    patchController,
    form,
    patchImages,
    Tconfig,
    collectFromForm,
    collectQueries,
} from '@/lib/DAL/controllers/universalControllers'

const config: Tconfig<typeof Product> = {
    DIR_PATH: './public/products/',
    model: ProductModel,
    multImages: true,
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const query = collectQueries(searchParams, config)
    return getController(query, config)
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
    const props: any = collectFromForm(await req.formData(), config)
    return addController(props, config)
}

export async function DELETE(req: NextRequest): Promise<NextResponse<any>> {
    const { name, _id } = await req.json()
    return deleteController({ name, _id }, config)
}

export async function PATCH(req: NextRequest): Promise<NextResponse<any>> {
    const props: any = collectFromForm(await req.formData(), config)
    console.log(props)
    return patchController({ ...props }, config)
}
