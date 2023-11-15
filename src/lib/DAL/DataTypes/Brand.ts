import mongoose, { FilterQuery, Model, Query, QueryOptions, Schema } from 'mongoose'

export interface IBrand{
	_id?:string
	name:string
	description:string,
	image:string
}

export const BrandDefinition = {
	_id:{type:String},
	name:{type:String},
	description:{type:String},
	image:{type:String}
}


const tst = new Schema<typeof BrandDefinition>(BrandDefinition)

const test = mongoose.model('test',tst)

type T = typeof BrandDefinition

test.find({z:'test'})

function make<T>(model:Model<T>, obj:Omit<T,'_id'>){
	return new model(obj)
}

function makePartial<T>(model:Model<T>, obj:Partial<Omit<T,'_id'>>){
	return new model(obj)
}

