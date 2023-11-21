import Carousel from "../../ui/Carousel";
import Price from "../Price";
import Discount from "../Discount";
import Link from "next/link";
import BuyButton from "@/components/ui/BuyButton";
import Image from "next/image";
type ProductProps = {
	name: string;
	brand: string;
	category: string;
	price: number;
	discount: number;
	description: string;
	images: string[];
	brandImage: string;
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
			rounded-md p-3 bg-cyan-200 overflow-hidden
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
					<h3 className="text-accent1-400 text-2xl uppercase font-bold">{product.name}</h3>
				</Link>
				<span className="text-xl font-semibold">
					{product.brand}
				</span>
				<span className="text-lg capitalize justify-self-end text-gray-600">
					{product.category}
				</span>

				<Price
					className="text-2xl"
					price={product.price || 200}
					discount={product.discount || 0}
				/>
				{role === "admin" ? (
					<></>
				) : (
					<BuyButton className="justify-self-center" {...product} />
				)}
			</div>
		</div>
	);
}
