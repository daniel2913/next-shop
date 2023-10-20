import { brandProps } from '@/lib/DAL/dataTypes/Brand'
import { Brand, BrandModel, CategoryModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import { NextRequest, NextResponse } from 'next/server'
import { Image, deleteImages, handleImages, saveImages } from '@/helpers/images'

const DIR_PATH = './public/categories/'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name') || ''
    try {
        await dbConnect()
        const categories = await CategoryModel.find({
            name: new RegExp(name),
        })
            .lean()
            .exec()
        return NextResponse.json(categories, {
            status: 200,
        })
    } catch (error) {
        return NextResponse.json('Server error', {
            status: 500,
        })
    }
}
