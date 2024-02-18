import { clearSavedAction } from "@/actions/savedProducts";
import { SavedProductsNaked } from "@/components/product/SavedProducts";
import { Button } from "@/components/ui/Button";
import ClearSaved from "./clear";
import Loading from "@/components/ui/Loading";


export default function SavedPage(){
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
			<Loading>
			<SavedProductsNaked/>
			</Loading>
		</main>
	)
}
