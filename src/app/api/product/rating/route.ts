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
	if (!(id || vote)) return new NextResponse("Invalid Request", { status: 400 })
	if (!session?.user) return new NextResponse("Not Authorized", { status: 401 })
	console.log(1)
	const user = await UserCache.get(session.user.name)
	if (!user) return new NextResponse("Bad Cache", { status: 500 })
	const res = await ProductModel.custom.updateRatings(
		id,
		vote,
		user.id
	)
	console.log(2)
	if (!res) return new NextResponse("Not Authorized", { status: 401 })
	return NextResponse.json(res, { status: 200 })
}
