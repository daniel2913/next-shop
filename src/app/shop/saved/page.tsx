import { redirect } from "next/navigation"
import { getProductsByIds } from "@/actions/product"
import { auth } from "@/actions/common"
import InfSavedList from "@/lists/InfSavedList"
import ClearSaved from "./clear"

export default async function SavedPage() {
	try {
		const user = await auth("user")
		const saved = await getProductsByIds(user.saved.slice(0, 20))
		return (
			<main
				className="
					grid h-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]
					items-center justify-items-center
					gap-y-4
					bg-background p-5
				"
			>
				<ClearSaved />
				<InfSavedList
					products={saved}
					saved={user.saved}
				/>
			</main>
		)
	} catch {
		redirect("/shop/home")
	}
}
