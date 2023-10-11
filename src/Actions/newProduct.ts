'use server'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import dbConnect from '../lib/dbConnect'
import { BrandModel, CategoryModel, ProductModel } from '@/lib/DAL/MongoModels'
import createNewProduct from '@/lib/DAL/Controllers/productController/newProduct'

interface props {
    name: string
    brand: string
    category: string
    images: File[]
    description: string
    price: number
    discount: number
}

export async function handleProductForm(form: FormData) {
    'use server'
    const name = form.get('name') as string
    const brand = form.get('brand') as string
    const category = form.get('category') as string
    const description = form.get('description') as string
    const price = Number(form.get('price')) || 0
    const image = (form.get('image') as File) || null
    const images = (form.getAll('images') as File[]) || null
    const discount = 0
    if (image) images.push(image)
    if (!name || !price || !description || !category || !brand)
        return 'Not all fields are filled!'
    const res = await prepareNewProduct({
        name,
        brand,
        category,
        description,
        price,
        discount,
        images,
    })
    return res
}

export default async function prepareNewProduct(props: props) {
    await dbConnect()

    const brand = (await BrandModel.findOne({ name: props.brand }))?._id
if (!brand) return 'Brand does not exist'

    const category = (await CategoryModel.findOne({ name: props.category }))
        ?.name
    if (!category) return 'Category does not exist'

    const link = encodeURIComponent((props.brand + props.name).toLowerCase())
    if (await ProductModel.exists({ link })) return 'Product already exists!'

    let imageNames: string[] = []
    for (const image of props.images) {
        const ext = image.type?.split('/').pop()
        if (ext == 'jpeg' || ext == 'png') {
            const imageName =
                new mongoose.Types.ObjectId().toString() + '.' + ext
            imageNames.push(imageName)
            fs.writeFile(
                path.resolve('./public/products/' + imageName),
                Buffer.from(await image.arrayBuffer())
            )
        }
    }

    createNewProduct({ ...props, images: imageNames, brand, category, link })
}
