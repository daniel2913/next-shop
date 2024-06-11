import { GlobalTestAuth } from "@/actions/__mocks__/auth"
import { getUserStateAction, setCartAction } from "@/actions/cart"
import { completeOrderAction} from "@/actions/order"
import { toggleSavedAction } from "@/actions/saved"
import { authUser, registerUserAction } from "@/actions/user"
import { ProductModel, UserModel, OrderModel } from "@/lib/Models/__mocks__"

jest.mock("@/lib/Models")
jest.mock("@/actions/auth")


const auth = (global as any).auth as GlobalTestAuth
if (!auth) throw "No auth container"

it.concurrent("Save action", async () => {
	const product = await ProductModel.findOne({ id: 0 })
	expect(product).toBeTruthy()
	const user = await UserModel.findOne({ id: 0 })
	expect(user).toBeDefined()
	auth.user = user
	await toggleSavedAction(product!.id)
	expect(user!.saved).toHaveLength(1)
})

it.concurrent("Registration and authentication actions", async () => {
	const creds = { name: "test2", password: "thisistestpassword!123" }
	let err = await registerUserAction(creds.name, creds.password)
	expect(err).toBeUndefined()
	const user = await UserModel.findOne({ name: creds.name })
	expect(user!.name).toBe("test2")
	const res = await authUser(creds)
	expect(res!.name).toBe(creds.name)
	const neg = await authUser({ name: "false", password: "123" })
	expect(neg).toBeNull()
})

it.concurrent("Cart actions", async () => {
	auth.user = await UserModel.findOne({ id: 0 })
	const err = await setCartAction({ 0: 5, 2: 6 })
	expect(err).toBeFalsy()
	auth.user = await UserModel.findOne({ id: 0 })
	const state = await getUserStateAction()
	expect(state.cart).toHaveProperty("0")
	expect(state.cart).not.toHaveProperty("2")
})

it("Orders actions", async () => {
	const product = await ProductModel.findOne({ id: 0 })
	expect(product).toBeTruthy()
	auth.user = await UserModel.findOne({ id: 0 })
	expect(auth.user).toBeTruthy()
	const order = await OrderModel.create({ user: auth.user!.id, order: { 0: { price: product!.price, amount: 10 } } })
	expect(order).toBeTruthy()
	auth.user = await UserModel.findOne({ role: "admin" })
	const res = await completeOrderAction(order!.id)
	expect(res).toBeFalsy()
	let user = await UserModel.findOne({ id: 0 })
	expect(user?.votes[0]).toBe(0)
})
