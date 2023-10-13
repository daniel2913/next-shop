import { ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import Brand from './Brand.ts'
import Cart, { Item } from './Cart.ts'
import Category from './Category.ts'
import Inventory from './Inventory.ts'
import Product from './Product.ts'
import User from './User.ts'
import { BeAnObject } from '@typegoose/typegoose/lib/types'

export { Brand, Item, Cart, Category, Inventory, Product, User }

export const BrandModel =
    (mongoose.models.Brand as ReturnModelType<typeof Brand, BeAnObject>) ||
    getModelForClass(Brand)
export const UserModel =
    (mongoose.models.User as ReturnModelType<typeof User, BeAnObject>) ||
    getModelForClass(User)
export const CartModel =
    (mongoose.models.Cart as ReturnModelType<typeof Cart, BeAnObject>) ||
    getModelForClass(Cart)
export const CategoryModel =
    (mongoose.models.Category as ReturnModelType<
        typeof Category,
        BeAnObject
    >) || getModelForClass(Category)
export const InventoryModel =
    (mongoose.models.Inventory as ReturnModelType<
        typeof Inventory,
        BeAnObject
    >) || getModelForClass(Inventory)
export const ProductModel =
    (mongoose.models.Product as ReturnModelType<typeof Product, BeAnObject>) ||
    getModelForClass(Product)
