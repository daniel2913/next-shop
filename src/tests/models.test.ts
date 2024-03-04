import { BrandModel,CategoryModel,ProductModel, UserModel, OrderModel, DiscountModel } from "@/lib/Models"
import { validTestDiscount, validTestOrder, validTestProduct, validTestUser } from "./setEnvVars"

describe("All Models",()=>{
	it("Perform CRUD Operations", async () => {
		const createTest = await BrandModel.create({ name: "__TEST0__" })
		expect(createTest).toMatchObject({ name: "__TEST0__", image: "template.jpg" })
		const findTest1 = await BrandModel.find({ name: "__TEST0__"})
		const findTest2 = await BrandModel.findOne({ name: "__TEST0__" })
		expect(findTest1[0]).toMatchObject({name:"__TEST0__"})
		expect(findTest2).toMatchObject({name:"__TEST0__"})
		if (!findTest2) return
		const patchTest = await BrandModel.patch(findTest2.id,{name:"__!TEST!__"})
		expect(patchTest).toMatchObject({name:"__!TEST!__"})
		const patchedTest = await BrandModel.findOne({ name: "__TEST0__" })
		expect(patchedTest).toBeNull()
		if (!patchTest) return
		expect(await BrandModel.delete(findTest2.id)).toMatchObject(patchTest)
		const deletedTest = await BrandModel.findOne({ name: "__!TEST!__" })
		return expect(deletedTest).toBeNull()
	})
})

describe("Brand Model",()=>{
	it("Validates Input Params", async () => {
		expect(BrandModel.create({test:"test"})).rejects.toBeTruthy()
		expect(BrandModel.create({name:null})).rejects.toBeTruthy()
		return expect(BrandModel.create({name:12})).rejects.toBeTruthy()
	})
	it("Validates Duplicates", async () => {
		const test = await BrandModel.create({ name: "__TEST1__" })
		if (!test) return
		await expect(BrandModel.create({name:"__TEST1__"})).rejects.toBeTruthy()
		return expect(BrandModel.delete(test.id)).resolves.toMatchObject(test)

	})
})

describe("Category Model",()=>{
	it("Validates Input Params", async () => {
		expect(CategoryModel.create({test:"test"})).rejects.toBeTruthy()
		expect(CategoryModel.create({name:null})).rejects.toBeTruthy()
		return expect(CategoryModel.create({name:12})).rejects.toBeTruthy()
	})
	it("Validates Duplicates", async () => {
		const test = await CategoryModel.create({ name: "__TEST1__" })
		if (!test) return
		await expect(CategoryModel.create({name:"__TEST1__"})).rejects.toBeTruthy()
		return expect(CategoryModel.delete(test.id)).resolves.toMatchObject(test)

	})
})

describe("Product Model",()=>{
	it("Validates Input Params", async () => {
		expect(ProductModel.create({test:"test"})).rejects.toBeTruthy()
		expect(ProductModel.create({...validTestProduct,name:undefined})).rejects.toBeTruthy()
		expect(ProductModel.create({...validTestProduct,price:undefined})).rejects.toBeTruthy()
		expect(ProductModel.create({...validTestProduct,brand:"test"})).rejects.toBeTruthy()
		return expect(ProductModel.create({...validTestProduct,category:"test"})).rejects.toBeTruthy()
	})
	it("Validates Duplicates", async () => {
		const test = await ProductModel.create(validTestProduct)
		if (!test) return
		await expect(ProductModel.create(validTestProduct)).rejects.toBeTruthy()
		return expect(ProductModel.delete(test.id)).resolves.toMatchObject(test)
	})
})

describe("User Model",()=>{
	it("Validates Input Params", async () => {
		expect(UserModel.create({test:"test"})).rejects.toBeTruthy()
		expect(UserModel.create({...validTestUser,name:undefined})).rejects.toBeTruthy()
		expect(UserModel.create({...validTestUser,passwordHash:"test"})).rejects.toBeTruthy()
		return expect(UserModel.create({...validTestUser,passwordHash:undefined})).rejects.toBeTruthy()
	})
	it("Validates Duplicates", async () => {
		const test = await UserModel.create(validTestUser)
		if (!test) return
		await expect(UserModel.create(validTestUser)).rejects.toBeTruthy()
		return expect(UserModel.delete(test.id)).resolves.toMatchObject(test)
	})
})


describe("Order Model",()=>{
	it("Validates Input Params", async () => {
		expect(OrderModel.create({test:"test"})).rejects.toBeTruthy()
		expect(OrderModel.create({...validTestOrder,user:undefined})).rejects.toBeTruthy()
		expect(OrderModel.create({...validTestOrder,order:{t:{amount:2,price:10}}})).rejects.toBeTruthy()
		return expect(OrderModel.create({...validTestOrder,status:"test"})).rejects.toBeTruthy()
	})
})


describe("Discount Model",()=>{
	it("Validates Input Params", async () => {
		expect(DiscountModel.create({test:"test"})).rejects.toBeTruthy()
		expect(DiscountModel.create({...validTestDiscount,discount:100})).rejects.toBeTruthy()
		expect(DiscountModel.create({...validTestDiscount,discount:-5})).rejects.toBeTruthy()
		expect(DiscountModel.create({...validTestDiscount,brands:["test"]})).rejects.toBeTruthy()
		expect(DiscountModel.create({...validTestDiscount,categories:["test"]})).rejects.toBeTruthy()
		return expect(DiscountModel.create({...validTestDiscount,expires:Date.now()-10000})).rejects.toBeTruthy()
	})
})
