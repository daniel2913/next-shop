import { redirect } from "next/navigation";
import { getProductsByIds } from "@/actions/product";
import { auth } from "@/actions/common";
import InfSavedList from "@/lists/InfSavedList";
import ClearSaved from "./clear";
import RequireAuth from "@/providers/RequireAuth";

export default async function SavedPage() {
	try {
		const user = await auth("user");
		console.log(user.saved)
		const saved = await getProductsByIds(user.saved.slice(0, 20));
		return (
			<RequireAuth>
				<main
					className="grid size-full grid-cols-[repeat(auto-fit,minmax(18rem,1fr))] items-center justify-items-center gap-y-4 bg-background p-5"
				>
					<ClearSaved />
					<InfSavedList products={saved} saved={user.saved} />
				</main>
			</RequireAuth>
		);
	} catch {
		redirect("/shop/home");
	}
}
