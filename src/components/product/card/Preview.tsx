import Price from "./Price";
import React from "react";
import type { PopulatedProduct } from "@/lib/Models/Product";
import ProductCarousel from "./ProductCarousel";
import Rating from "./Rating";
import { LocalModal } from "@/components/modals/Base";
import DetailedProduct from "@/components/modals/ProductDetailed";

type Props = {
	product: Pick<PopulatedProduct, "name" | "price" | "description"> & {
		brand: string;
		category: string;
		images: File[] | string[];
	};
};
export default function PreviewProductCard({ product }: Props) {
	const currentImageUrls = React.useRef<string[]>([]);
	const [show,setShow] = React.useState(false)
	currentImageUrls.current = React.useMemo(() => {
		currentImageUrls.current = [];
		const res: string[] = [];
		if (!product.images) return res;
		for (const image of product.images) {
			if (typeof image === "string") res.push(image);
			else {
				res.push(URL.createObjectURL(image))
			};
		}
		currentImageUrls.current.push(...res);
		return res;
	}, [product.images]);
	return (
		<article className="h-lgCardY  w-lgCardX rounded-lg border-2 bg-card text-card-foreground shadow-lg">
			<main className="grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr] px-4 pt-2">
				<ProductCarousel
					className="col-span-2 h-full p-0"
					images={
						currentImageUrls.current.length > 0
							? currentImageUrls.current
							: ["template.jpg"]
					}
					width={250}
					height={190}
				/>
				<Rating
					id={-1}
					onChange={() => undefined}
					value={-1}
					rating={0}
					voters={0}
					className="col-span-2 justify-self-center"
				/>
				<button
					onClick={() => setShow(true)}
					type="button"
					className="col-span-2 appearance-none"
				>
					<h3 className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-nowrap text-2xl font-bold uppercase leading-6 tracking-tight">
						{product.name}
					</h3>
				</button>
				<span className="overflow-hidden whitespace-nowrap text-ellipsis text-nowrap text-xl font-semibold">
					{product.brand}
				</span>
				<span className="justify-self-end overflow-hidden text-ellipsis whitespace-nowrap text-nowrap text-xl font-semibold text-muted-foreground">
					{product.category}
				</span>
				<Price
					className="text-2xl"
					discount={0}
					price={product.price}
				/>
			</main>
			{show &&
				<LocalModal isOpen={show} close={() => setShow(false)}>
					<DetailedProduct {...product} discount={0} images={currentImageUrls.current} id={0} voters={0} rating={0} />
				</LocalModal>
			}
		</article>
	);
}
