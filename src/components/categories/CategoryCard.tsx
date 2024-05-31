import React from "react";
import type { Category } from "@/lib/Models/index";
import Image from "next/image";
import Link from "next/link";
type Props = {
	category: Category;
	products: number;
	className?: string;
};
export default function CategoryCard({ category, products, className }: Props) {
	return (
		<article
			title={category.name}
			className={`h-40 w-36 rounded-lg border-2 bg-card text-card-foreground shadow-lg ${className}`}
		>
			<Link href={`/shop?category=${category.name}`}>
				<main className="flex flex-col items-center justify-center rounded-lg p-2">
					<Image
						className="size-20 rounded-lg"
						width={245}
						height={195}
						alt={category.name}
						src={`/categories/${category.image}`}
					/>
					<h2 className="w-full overflow-hidden text-nowrap whitespace-nowrap overflow-ellipsis text-center text-2xl font-semibold">
						{category.name}
					</h2>
					<span className="text-xl font-medium">
						{`${products} item${products % 10 === 1 ? "" : "s"}`}
					</span>
				</main>
			</Link>
		</article>
	);
}
