import BuyButton from "@/components/ui/BuyButton";
import Carousel from "../../ui/Carousel";
import Discount from "../Discount";
import Image from "next/image";
import Link from "next/link";
import Price from "../Price";
import Rating from "@/components/ui/Rating";
import { PopulatedProduct } from "@/lib/DAL/Models/Product";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


type Props = {
	className: string;
	product: PopulatedProduct;
	session: Session|null;
};

export default async function ProductCard({ className, product}: Props) {
	const session = await getServerSession(authOptions)
	console.log('session - ', session)
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
						discount={product.discount.discount || 0}
					/>
				}
				brandImage={
					<Image
						alt={product.brand.name}
						height={30}
						src={`/brands/${product.brand.image}`}
						width={30}
					/>
				}
			>
				{product.images.map((img,idx) => (
					<Image
						priority={idx===0 ? true : false}
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
					href={`./product/${product.brand.name}/${product.name}`}
				>
					<h3 className="text-2xl font-bold uppercase text-accent1-400">
						{product.name}
					</h3>
				</Link>
				<Rating id={product.id} rating={product.rating||0} ownVote={product.ownVote} voters={product.voters} className="col-span-2 max-h-8" />

				<span className="text-xl font-semibold">{product.brand.name}</span>
				<span className="justify-self-end text-lg capitalize text-gray-600">
					{product.category.name}
				</span>
				<Price
					className="text-2xl"
					discount={product.discount.discount || 0}
					price={product.price || 200}
				/>
				{session?.user?.role === "admin" ? (
					null
				) : (
					<BuyButton className="justify-self-center" id={product.id} />
				)}
			</div>
		</div>
	);
}
