import { ProductModel } from '@/lib/DAL/MongoModels'
import { cartItem, validCartItemProps } from '@/store/cartStore/cartSlice'
import { NextRequest, NextResponse } from 'next/server'

function isValidCartType(cart: any[]): cart is cartItem[] {
    if (Array.isArray(cart) && typeof cart[0] === 'object') {
        const props = Object.entries(cart[0]).map((entry) => entry[0])
        let valid = true

        for (const prop of props) {
            if (!(prop in validCartItemProps)) {
                valid = false
                break
            }
        }
        for (const prop of validCartItemProps) {
            if (!(prop in props)) {
                valid = false
                break
            }
        }
        return valid ? true : false
    }
    return false
}

function serverValidation(cart: cartItem[]) {
    let validCart: cartItem[] = []
    for (const i of cart) {
        ProductModel.exists()
    }
    return cart
}

function validateCartCache(cache: any[]) {
    let cart: cartItem[] = []
    if (isValidCartType(cache)) {
        cart = cache
    }
    cart = serverValidation(cart)
}

export async function POST(req: NextRequest) {
    const cache = await req.json()
    validateCartCache(cache)

    return new NextResponse(data, {
        status: 200,
        headers: {
            'Content-Type': 'image',
        },
    })
}
