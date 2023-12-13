import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { ProductModel} from "@/lib/DAL/Models"
import { UserCache } from "@/helpers/cachedGeters"
import {sql} from "drizzle-orm"

export async function GET(req:NextRequest){
	const ids = req.nextUrl.searchParams.getAll("id")
	const user = await getServerSession(authOptions)
	if (!user?.user?.id) return new NextResponse('Not Authorized',{status:401}) 
	const res = await ProductModel.raw(sql.raw(`
		SELECT id,votes,voters FROM shop.products
		WHERE id in (${ids});
	`)) as any as [{id:number,votes:(number|null)[],voters:number[]}]
	const ownVotes = res
		.filter(row=>row.voters.includes(user.user!.id!))
		.map(row=>[row.id,row.votes[row.voters.indexOf(user.user!.id!)!]])
	return NextResponse.json(Object.fromEntries(ownVotes))
}

export async function POST(req: NextRequest) {
	const [session, { id, vote }] = await Promise.all([
		getServerSession(authOptions),
		req.json(),
	])
	if (!(id || vote)) return new NextResponse("Invalid Request", { status: 400 })
	if (!session?.user) return new NextResponse("Not Authorized", { status: 401 })
	const user = await UserCache.get(session.user.name)
	if (!user) return new NextResponse("Bad Cache", { status: 500 })
	const res = await ProductModel.custom.updateRatings(
		id,
		vote,
		user.id
	)
	if (!res) return new NextResponse("Not Authorized", { status: 401 })
	return NextResponse.json(res, { status: 200 })
}
