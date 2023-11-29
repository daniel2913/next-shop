import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export default function POST(req:NextRequest){
	const session = getServerSession(req, authOptions)

}
