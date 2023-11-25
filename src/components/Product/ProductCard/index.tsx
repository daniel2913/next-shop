import BuyButton from "@/components/ui/BuyButton";
import Carousel from "../../ui/Carousel";
import Discount from "../Discount";
import Image from "next/image";
import Link from "next/link";
import Price from "../Price";

type ProductProps = {
	_id: string
	brand: string;
	brandImage: string;
	category: string;
	description: string;
	discount: number;
	images: string[];
	name: string;
	price: number;
};

type Props = {
	className: string;
	product: ProductProps;
	role: "admin" | "user";
};

export default async function ProductCard({ className, product, role }: Props) {
	return (
		<div
			className={`
            ${className}
			overflow-hidden rounded-md bg-cyan-200 p-3
			`}
		>
			<Carousel
				preview
				previewClassName="absolute bottom-0 left-0 right-0 h-1/5"
				className="relative h-3/5 p-1"
				discount={
					<Discount
						className="w-12 -rotate-[20deg] text-lg font-bold"
						discount={product.discount || 0}
					/>
				}
				brandImage={
					<Image
						alt={product.brand}
						height={30}
						src={`/brands/${product.brandImage}`}
						width={30}
					/>
				}
			>
				{product.images.map((img) => (
					<Image
						fill
						className=""
						sizes="
							(max-width:640px) 70vw
							(max-width:1024px) 30vw
							25vw
							"
						key={img}
						src={`/products/${img}`}
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
					className="col-span-2 "
					href={`./product/${product.brand}/${product.name}`}
				>
					<h3 className="text-2xl font-bold uppercase text-accent1-400">
						{product.name}
					</h3>
				</Link>
				<span className="text-xl font-semibold">{product.brand}</span>
				<span className="justify-self-end text-lg capitalize text-gray-600">
					{product.category}
				</span>

				<Price
					className="text-2xl"
					discount={product.discount || 0}
					price={product.price || 200}
				/>
				{role === "admin" ? (
					null
				) : (
					<BuyButton className="justify-self-center" {...product} />
				)}
			</div>
		</div>
	);
}
