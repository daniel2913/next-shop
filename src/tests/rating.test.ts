import { completeOrderAction } from "@/actions/order";
import { UserModel, ProductModel, OrderModel, User, Product, Order } from "@/lib/Models";
import { validTestOrder, validTestProduct, validTestUser as _validTestUser } from "./setEnvVars";
import { updateVoteAction } from "@/actions/rating";

jest.mock('@/actions/common')

const validTestUser = { ..._validTestUser, name: "TEST2__" }

afterAll(async () => {
	const user = await UserModel.findOne({ name: validTestUser.name })
	if (user) {
		const order = await OrderModel.findOne({ user: user.id })
		if (order)
			OrderModel.delete(order.id)
		UserModel.delete(user.id)
	}
	const product = await ProductModel.findOne({ name: validTestProduct.name })
	if (product)
		ProductModel.delete(product.id)

})

let TestUser: User
let TestProduct: Product
let TestOrder: Order

describe("Order and Rating", () => {
	describe("Create test objects", () => {
		it("Creates User", async () => {
			const user = await UserModel.create(validTestUser)
			if (!user) fail()
			TestUser = user
		})
		it("Creates Product", async () => {
			const product = await ProductModel.create(validTestProduct)
			if (!product) fail()
			TestProduct = product
		})
	})
	describe("User Makes Order", () => {
		it("Creates Order", async () => {
			const contents = {
				[TestProduct.id]: { amount: 1, price: TestProduct.price }
			}
			const order = await OrderModel.create({ ...validTestOrder, user: TestUser.id, order: contents })
			if (!order) fail()
			TestOrder = order
		})
	})
	describe("Order is completed", () => {
		it("Completes Order and lets User vote", async () => {
			await completeOrderAction(TestOrder.id)
			TestUser = (await UserModel.findOne({ name: validTestUser.name }))!
			TestProduct = (await ProductModel.findOne({ name: validTestProduct.name }))!
			expect(TestUser).toMatchObject({ votes: { [TestProduct.id]: 0 } })
			expect(TestProduct).toMatchObject({ votes: 0, voters: 0, rating:null })
		})
	})
	describe("User can vote", () => {
		it("Can vote once", async () => {
			await updateVoteAction(TestProduct.id, 5, TestUser)
			TestUser = (await UserModel.findOne({ name: validTestUser.name }))!
			TestProduct = (await ProductModel.findOne({ name: validTestProduct.name }))!
			expect(TestUser).toMatchObject({ votes: { [TestProduct.id]: 5 } })
			expect(TestProduct).toMatchObject({ votes: 5, voters: 1,rating:5 })
		})
		it("Can vote multiple times", async ()=>{
		await updateVoteAction(TestProduct.id, 3, TestUser)
		TestUser = (await UserModel.findOne({ name: validTestUser.name }))!
		TestProduct = (await ProductModel.findOne({ name: validTestProduct.name }))!
		expect(TestUser).toMatchObject({ votes: { [TestProduct.id]: 3 } })
		expect(TestProduct).toMatchObject({ votes: 3, voters: 1,rating:3 })
		})
	})
})


