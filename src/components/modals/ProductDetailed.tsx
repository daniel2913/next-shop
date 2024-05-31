"use client";
import type { PopulatedProduct } from "@/lib/Models/Product";
import ProductCarousel from "../product/card/ProductCarousel";
import { ScrollArea } from "../ui/ScrollArea";
import React from "react";
import BuyButton from "../product/card/BuyButton";
import useResponsive from "@/hooks/useResponsive";
import Price from "../product/card/Price";

export default function DetailedProduct(product: PopulatedProduct) {
	const mode = useResponsive();
	if (mode === "desktop")
		return (
			<article className="flex h-[70vh] w-[80vw] min-w-[45rem] content-center items-center gap-4 rounded-md bg-background p-4">
				<ProductCarousel images={product.images} width={700} height={500} />
				<section className="flex h-full flex-auto basis-3/5 flex-col">
					<div className="mb-2 flex justify-between">
						<Price
							className="text-3xl"
							price={product.price}
							discount={product.discount}
						/>
						<BuyButton id={product.id} className="h-12 w-1/3 max-w-32" />
					</div>
					<ScrollArea className="h-full w-full overflow-y-hidden pr-1">
						<p className="text-2xl">{product.description}</p>
					</ScrollArea>
				</section>
			</article>
		);
	return (
		<article className="relative flex h-full w-full flex-col content-center items-center overflow-y-scroll rounded-md bg-background">
			<header className="top-0 mb-2 w-full bg-secondary">
				<ProductCarousel
					className="mb-2 h-fit w-full"
					imageWrapperClassName="size-full object-cover"
					images={product.images}
					brand={product.brand.images[0]}
					brandName={product.brand.name}
					width={600}
					height={460}
				/>
				<h3 className="w-full bg-secondary px-2 pb-2 text-4xl font-bold capitalize">
					{product.name}
				</h3>
			</header>
			<section className="mb-2 flex flex-auto basis-2/5 flex-col px-2 pb-4">
				<div className="flex justify-between">
					<Price
						className="text-3xl"
						price={product.price}
						discount={product.discount}
					/>
					<BuyButton id={product.id} className="h-12 w-1/3 max-w-32" />
				</div>
				<section>
					<p className="h-fit w-full text-wrap break-words text-2xl">
						{product.description}
					</p>
				</section>
			</section>
		</article>
	);
}
