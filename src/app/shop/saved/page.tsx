import ClearSaved from "./clear";
import { redirect } from "next/navigation";
import { getProductsByIds } from "@/actions/product";
import SavedList from "@/components/product/SavedList";
import { auth } from "@/actions/common";


export default async function SavedPage(){
	try{
		const user = await auth("user")
	const saved = await getProductsByIds(user.saved.slice(0,20))
	return(
		<main
			className="
					h-full p-5 bg-background
					grid grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]
					gap-y-4
					items-center justify-items-center
				"
		>
			<ClearSaved/>
			<SavedList products={saved} saved={user.saved}/>
		</main>
	)
	}
	catch{
		redirect("/shop/home")
	}
}
