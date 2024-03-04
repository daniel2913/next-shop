import { completeOrderAction, createOrderAction } from "@/actions/order";
import { UserModel, UserModel as mockUM, ProductModel, OrderModel, User, Product, Order } from "@/lib/Models";
import { validTestProduct as _validTestProduct, validTestUser as _validTestUser } from "./setEnvVars";
import { updateVoteAction } from "@/actions/rating";
import { getUserStateAction, setCartAction } from "@/actions/cart";
import { toggleSavedAction } from "@/actions/saved";


const validTestUser = { ..._validTestUser, name: "TEST2__" }
const validTestProduct = { ..._validTestProduct, name: "__TEST2__" }
let TestUser: User
let TestProduct: Product
let TestOrder: Order
let TestCart: Record<number, number>


const mockUser = validTestUser
jest.mock('@/actions/common', () => {
	const orig = jest.requireActual('@/actions/common')
	return {
		...orig,
		auth: () => mockUM.findOne({ name: mockUser.name })
	}
})

beforeAll(async () => {
	const user = await UserModel.create(validTestUser)
	if (!user) fail()
	TestUser = user

	const product = await ProductModel.create(validTestProduct)
	if (!product) fail()
	TestProduct = product
	return product
})

describe("Order and Rating", () => {
	describe("Create test Objects", () => {

	})
	describe("User saves Product", () => {
		it("Can save Product", async () => {
			const res1 = await toggleSavedAction(TestProduct.id)
			const res2 = await toggleSavedAction(TestProduct.id)
			expect(res1).toBe(true)
			expect(res2).toBe(false)
			return res2
		})
	})
	describe("User adds Product to Cart", () => {
		it("Sends order details", async () => {
			TestCart = { [TestProduct.id]: 1, [1]: 1 }
			const resp = await setCartAction(TestCart)
			expect(resp).toBeFalsy()
			return resp
		})
		it("Validates unknown fields", async () => {
			return await expect(setCartAction({ test: 1 })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
		})
		it("Validates invalid ids", async () => {
			return await expect(setCartAction({ [-1]: 1 })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
		})
		it("Validates unknown values", async () => {
			return await expect(setCartAction({ 1: "test" })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
		})
		it("Validates invalid amounts", async () => {
			return await expect(setCartAction({ 1: -1 })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
		})
	})
	describe("User gets Cart contents", () => {
		it("Validates order details", async () => {
			TestCart = (await getUserStateAction()).cart
			expect(TestCart).toEqual({ [TestProduct.id]: 1 })
		})
	})
	describe("User Makes Order", () => {
		it("Creates Order", async () => {
			const order = await createOrderAction({ [TestProduct.id]: { amount: 1, price: TestProduct.price } })
			expect(order).toBeFalsy()
			const created = await OrderModel.findOne({ user: TestUser.id })
			if (!created) fail()
			TestOrder = created
			return order
		})
		it("Makes last second validation", async () => {
			expect(createOrderAction({ [TestProduct.id]: { amount: 1, price: 10 } })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
			expect(createOrderAction({ [TestProduct.id]: { amount: 0, price: TestProduct.price } })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
			expect(createOrderAction({ [1]: { amount: 1, price: 10 } })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
			expect(createOrderAction({ test: "test" })).resolves.toMatchObject(expect.objectContaining({ error: expect.any(String) }))
			return 0
		})
	})
	describe("Order is completed", () => {
		it("Completes Order and lets User vote", async () => {
			await completeOrderAction(TestOrder.id)
			TestUser = (await UserModel.findOne({ name: validTestUser.name }))!
			TestProduct = (await ProductModel.findOne({ name: validTestProduct.name }))!
			expect(TestUser).toMatchObject({ votes: { [TestProduct.id]: 0 } })
			expect(TestProduct).toMatchObject({ votes: 0, voters: 0, rating: null })
			return 0
		})
	})
	describe("User can vote", () => {
		it("Can vote once", async () => {
			await updateVoteAction(TestProduct.id, 5)
			TestUser = (await UserModel.findOne({ name: validTestUser.name }))!
			TestProduct = (await ProductModel.findOne({ name: validTestProduct.name }))!
			expect(TestUser).toMatchObject({ votes: { [TestProduct.id]: 5 } })
			expect(TestProduct).toMatchObject({ votes: 5, voters: 1, rating: 5 })
			return 0
		})
		it("Can vote multiple times", async () => {
			await updateVoteAction(TestProduct.id, 3)
			TestUser = (await UserModel.findOne({ name: validTestUser.name }))!
			TestProduct = (await ProductModel.findOne({ name: validTestProduct.name }))!
			expect(TestUser).toMatchObject({ votes: { [TestProduct.id]: 3 } })
			expect(TestProduct).toMatchObject({ votes: 3, voters: 1, rating: 3 })
			return 0
		})
	})
})


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
