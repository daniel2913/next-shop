import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { authOptions } from "../../auth/[...nextauth]/route"
import { ProductModel, UserModel } from "@/lib/DAL/Models"
import { UserCache } from "@/helpers/cachedGeters"

export async function POST(req: NextRequest) {
	const [session, { id, vote }] = await Promise.all([
		getServerSession(authOptions),
		req.json(),
	])
	if (!(id || vote))
		return new NextResponse("Invalid Request", { status: 400 })
	if (!session?.user?.name)
		return new NextResponse("Not Authorized", { status: 401 })
	const user = await UserCache.get(session.user.name)
	const prevVote = user.votes[id.toString()] ?? -1
	if (prevVote === -1)
		return new NextResponse("Not Authorized", { status: 401 })
	const res = await ProductModel.custom.updateRatings(
		id,
		vote - prevVote,
		user.id
	)
	if (!res)
		return new NextResponse("Not Authorized", { status: 401 })
	const newBought = { ...user.votes, [id.toString()]: vote }
	UserModel.patch(user.id, { votes: newBought })
	UserCache.patch(user.name, { votes: newBought })
	return NextResponse.json(res, { status: 200 })
}
