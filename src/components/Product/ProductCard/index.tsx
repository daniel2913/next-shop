import Carousel from "../../ui/Carousel";
import Price from "../Price";
import Discount from "../Discount";
import ImageComponent from "@/components/ui/ImageComponent";
import Link from "next/link";
import BuyButton from "@/components/ui/BuyButton";
import Image from "next/image";
import type { Brand, Product } from "../../../lib/DAL/Models";
type ProductProps = {
	name: string;
	brand: string;
	category: string;
	price: number;
	discount: number;
	description: srting;
	images: string[];
	brandImage: string;
};

type props = {
	className: string;
	product: ProductProps;
	role: "admin" | "user";
};

export default async function ProductCard({ className, product, role }: props) {
	return (
		<div
			className={`
            ${className}
			rounded-md p-3 bg-red-200 overflow-hidden
			`}
		>
			<Carousel
				className="
						h-3/5 p-1 relative
					"
				discount={
					<Discount
						className="w-12 text-lg font-bold -rotate-[20deg]"
						discount={product.discount || 0}
					/>
				}
				brandImage={
					<Image
						height={30}
						width={30}
						alt={product.brand}
						src={`/brands/${product.brandImage}`}
					/>
				}
			>
				{product.images.map((img, i) => (
					<Image
						fill={true}
						className=""
						sizes="
							(max-width:640px) 70vw
							(max-width:1024px) 30vw
							25vw
							"
						key={i + img}
						src={`/products/${img}`}
						fallback="/products/template.jpg"
						alt={product.name}
					/>
				))}
			</Carousel>
			<div
				className="
				grid grid-cols-2
			"
			>
				<Link
					className="col-span-2"
					href={`./product/${product.brand}/${product.name}`}
				>
					<h3 className="">{product.name}</h3>
				</Link>
				<span className="text-lg capitalize font-semibold">
					{product.brand}
				</span>
				<span className="text-lg capitalize justify-self-end text-gray-600">
					{product.category}
				</span>

				<Price
					className=""
					price={product.price || 200}
					discount={product.discount || 0}
				/>
				{role === "admin" ? (
					<></>
				) : (
					<BuyButton className="justify-self-end" {...product} />
				)}
			</div>
		</div>
	);
}
