import { redirect } from "next/navigation";
import { getProductsByIdsAction } from "@/actions/product";
import { auth } from "@/actions/auth";
import InfSavedList from "@/lists/InfSavedList";
import ClearSaved from "./clear";
import RequireAuthClient from "@/providers/RequireAuth";
import { isValidResponse } from "@/helpers/misc";

export default async function SavedPage() {
	try {
		const user = await auth("user");
		const saved = await getProductsByIdsAction(user.saved.slice(0, 20));
		if (!isValidResponse(saved)) throw ""
		return (
			<RequireAuthClient>
				<main
					className="grid size-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] items-center justify-items-center gap-y-4 bg-background p-5"
				>
					<ClearSaved />
					<InfSavedList products={saved} saved={user.saved} />
				</main>
			</RequireAuthClient>
		);
	} catch {
		redirect("/shop/home");
	}
}
