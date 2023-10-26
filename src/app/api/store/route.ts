import { Cart, UserModel } from '@/lib/DAL/MongoModels'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '../auth/[...nextauth]/route'

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
        return new NextResponse('Not OK Boomer', { status: 404 })
    }
    console.log(session)
    const cart = JSON.stringify(await req.json())
    console.log(cart)
    try {
        const res = await UserModel.updateOne(
            { username: session.user.name },
            { cart: cart }
        )
        if (!(res.acknowledged && res.matchedCount > 0)) throw ''
        console.log('OK, Boomer')

        return new NextResponse('OK,Boomer', { status: 200 })
    } catch (error) {
        console.log('Not OK, Boomer 500')
        return new NextResponse('Not OK,Boomer', { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.name) {
        console.log('Not OK, Boomer 404')
        return new NextResponse(JSON.stringify([]), { status: 404 })
    }
    const cart = (await UserModel.findOne({ username: session.user.name }))
        ?.cart
    if (cart) return new NextResponse(cart, { status: 200 })
    return new NextResponse(JSON.stringify([]), { status: 404 })
}
