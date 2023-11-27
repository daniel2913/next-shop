import { getAllBrands, getAllCategories } from "@/helpers/cachedGeters"
import { NextResponse } from "next/server"
import { Tconfig } from "."

type Tquery = { [i: string]: string | undefined }

export default async function getController(
	querys: Tquery,
	config: Tconfig<any>,
) {
	const { model } = config

	try {
		const query: any = {}
		for (const [key, value] of Object.entries(querys)) {
			if (value) {
				query[key] = value
			}
		}
		console.log(query)
		if (query.brand) {
			query.brand =
				(await getAllBrands())?.find((brand) => brand.id === query.brand)?.id ||
				undefined
		}
		if (query.category) {
			query.category =
				(await getAllCategories())?.find((cat) => cat.id === query.category)
					?.id || undefined
		}

		const res = await model.find(query)

		return NextResponse.json(res ? res : [], {
			status: res?.length === 0 ? 404 : 200,
		})
	} catch (error) {
		console.error(error)
		return NextResponse.json("Server error", {
			status: 500,
		})
	}
}
