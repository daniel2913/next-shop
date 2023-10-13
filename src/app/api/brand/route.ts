import { brandProps } from '@/lib/DAL/DataTypes/Brand'
import { Brand, BrandModel } from '@/lib/DAL/MongoModels'
import dbConnect from '@/lib/dbConnect'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req:NextRequest){
	const {searchParams} = new URL(req.url)
	const id = searchParams.get('id')
	const name = searchParams.get('name')
	try {
		await dbConnect()
		let brands:any
		if (id){
			brands = await BrandModel.findById(id).exec()
		}
		else if (name){
			{
				brands = await BrandModel.find({name}).exec()
			}
		}
		else {
			brands = await BrandModel.find().exec()
		}

		return NextResponse.json(brands,{
			status: 200
		})
	} catch (error) {
		return NextResponse.json('Server error',{
			status: 500
		})
	}
}

export async function PUT(req:NextRequest){
	const form = await req.formData()
	const props:any = {}
	for (const i of brandProps){
		props[i] = form.get(i)
	}
}	