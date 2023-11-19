import Carousel from "../../ui/Carousel";
import styles from "./index.module.scss";
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
			rounded-md p-2 bg-red-200
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
					<h3 className={styles.name}>{product.name}</h3>
				</Link>
				<span className="">{product.brand}</span>
				<span className="justify-self-end text-gray-600">
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
				<p
					className="
					col-span-2
					"
				>
					{product.description}
				</p>
			</div>
		</div>
	);
}
