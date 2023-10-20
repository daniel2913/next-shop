import { NextRequest, NextResponse } from 'next/server'
import getBrands from '@/lib/DAL/controllers/brandController/getBrands'
import addBrand from '@/lib/DAL/controllers/brandController/addBrand'
import deleteBrand from '@/lib/DAL/controllers/brandController/deleteBrand'
import patchBrand from '@/lib/DAL/controllers/brandController/patchBrand'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id') || undefined
    const name = searchParams.get('name') || undefined

    return getBrands({ name, id })
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
    const form = await req.formData()
    const props: { [a: string]: string | undefined | File } = {}
    for (const [key, value] of form.entries()) {
        if (key === 'image') {
            props[key] = value || undefined
        } else {
            props[key] = value.toString() || undefined
        }
    }
    return addBrand(props)
}

export async function DELETE(req: NextRequest): Promise<NextResponse<any>> {
    const { name, id } = await req.json()
    return deleteBrand({ name, id })
}

export async function PATCH(req: NextRequest): Promise<NextResponse<any>> {
    const form = await req.formData()
    const props: { [a: string]: string | undefined | File } = {}
    for (const [key, value] of form.entries()) {
        if (key === 'image') {
            props[key] = value || undefined
        } else {
            props[key] = value.toString() || undefined
        }
    }
    return patchBrand(props)
}
