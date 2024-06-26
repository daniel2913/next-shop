import { getProductsByIdsAction } from "@/actions/product";
import { auth } from "@/actions/auth";
import HorizontalScrollList from "../../components/ui/HorizontalScrollList";
import { GenericProductList } from "../GenericProductList";

type Props = {
	className?: string;
	num?: number;
};

export default async function SavedProducts(props: Props) {
	try {
		const user = await auth("user");
		if (user.saved.length === 0) return null;
		const saved = user.saved.slice(0, props.num || 10);
		const savedProducts = await getProductsByIdsAction(saved);
		if (savedProducts.length === 0) return null;
		return (
			<>
				<h2>Saved Products</h2>
				<HorizontalScrollList className={`${props.className}`}>
					<GenericProductList products={savedProducts} />
				</HorizontalScrollList>
			</>
		);
	} catch {
		return null;
	}
}
