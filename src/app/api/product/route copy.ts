import NewBrandForm from '@/components/forms'
import { Image, deleteImages, handleImages, saveImages } from '@/helpers/images'
import { BrandModel, ProductModel } from '@/lib/DAL/Models'
import dbConnect from '@/lib/dbConnect'
import { NextRequest, NextResponse } from 'next/server'

// {query,from}

const DIR_PATH = './public/products/'

export async function GET(req: NextRequest) {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')
    const brand = searchParams.get('brand')
    const category = searchParams.get('category')
    const from = Number(searchParams.get('from')) || 0

    const regex = new RegExp(query || '^')

    let dbQuery = ProductModel.find().limit(30).skip(from).lean()

    if (brand) {
        dbQuery = dbQuery.find({ brand })
    }
    if (category) {
        dbQuery = dbQuery.find({ category })
    }
    if (query) {
        dbQuery = dbQuery.regex('name', regex)
    }

    try {
        const products = (await dbQuery.exec()).map((product) => ({
            ...product,
            brand: product.brand.toString(),
        }))
        const brandIds = Array.from(
            new Set(products.map((product) => product.brand))
        )
        const brands = await BrandModel.find({ _id: brandIds })
        return NextResponse.json(
            { products, brands },
            {
                status: 200,
            }
        )
    } catch (error) {
        return NextResponse.json('Server error', {
            status: 500,
        })
    }
}

export async function PUT(req: NextRequest): Promise<NextResponse<any>> {
    dbConnect()

    const form = await req.formData()

    const props: any = {}
    let imageData: (File | string)[] = []
    for (const [key, value] of form.entries()) {
        if (key === 'images') {
            imageData = form.getAll(key)
        } else {
            props[key] = value.toString() || undefined
        }
    }
    if (!props.brand) {
        return new NextResponse('Validation error', { status: 400 })
    }
    const brand = await BrandModel.findOne({ name: props.brand }).exec()
    let needToSave = false
    let images: Image[] = []
    if (imageData) {
        const result = handleImages(imageData)
        if (result) {
            needToSave = true
            images = result
        } else {
            return new NextResponse('Validation error', { status: 400 })
        }
    } else {
        images = [{ name: 'template.jpeg', file: null as unknown as File }]
    }
    props.images = images.map((image) => image.name)

    if (!brand?.name) {
        return new NextResponse('Validation error', { status: 400 })
    }
    props.brand = brand
    props.link = encodeURI(
        props.brand.name.toLowerCase() + props.name.toLowerCase()
    )
    const newProduct = new ProductModel(props)
    try {
        await newProduct.validate()
    } catch (error) {
        return new NextResponse('Validation error', { status: 400 })
    }
    if (needToSave && !(await saveImages(images, DIR_PATH))) {
        return new NextResponse('Server error', { status: 500 })
    }
    try {
        const ans = await newProduct.save()
        if (!ans) {
            deleteImages(
                images.map((image) => image.name),
                DIR_PATH
            )
            throw ''
        }
        return new NextResponse(JSON.stringify(ans.toObject()), { status: 201 })
    } catch (error) {
        return new NextResponse('DB error', { status: 500 })
    }
}
