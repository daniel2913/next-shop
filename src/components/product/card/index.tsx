"use client";
import Edit from "@/../public/edit.svg";
import Heart from "@/../public/heart.svg";
import DetailedProduct from "@/components/modals/ProductDetailed";
import Rating from "@/components/product/card/Rating";
import type { PopulatedProduct } from "@/lib/Models/Product";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React from "react";
import BuyButton from "./BuyButton";
import Price from "./Price";
import ProductCarousel from "./ProductCarousel";
import { actions, useAppDispatch, useAppSelector } from "@/store/rtk";
import { toggleSaved } from "@/store/savedSlice";
import { setVote } from "@/store/votesSlice";
import { LocalModal } from "@/components/modals/Base";
import { error } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";

type Props = PopulatedProduct & {
	reload: (id: number) => void;
	update: (id: number, part: Partial<PopulatedProduct>) => void;
	idx?: number;
	fold?: number;
};

const ProductForm = dynamic(() => import("@/components/forms/ProductForm"));

const ProductCard = React.memo(function ProductCard(product: Props) {
	const [show, setShow] = React.useState(false)
	const vote = useAppSelector(state => state.votes.votes[product.id]);
	const dispatch = useAppDispatch()

	const onVoteChange = React.useCallback(
		async (val: number) => {
			const res = await dispatch(actions.votes.setVote({ id: product.id, val }));
			if (!isValidResponse(res.payload)) error(res.payload);
			product.update(product.id, res.payload);
		},
		[product.id, setVote, product.update],
	);

	const priority = product.idx ? product.idx < (product.fold || 10) : false;

	return (
		<article className="h-lgCardY  w-lgCardX rounded-lg border-2 bg-card text-card-foreground shadow-lg">
			<main className="grid grid-cols-2 grid-rows-[12rem,1fr,1fr,1fr,2fr] px-4 pt-2">
				<ProductCarousel
					className="col-span-2 h-full p-0"
					brand={product.brand.images[0]}
					images={product.images}
					brandName={product.brand.name}
					width={250}
					height={190}
					priority={priority}
				/>
				<Rating
					id={product.id}
					onChange={onVoteChange}
					value={vote ?? -1}
					rating={product.rating || 0}
					voters={product.voters}
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
					{product.brand.name}
				</span>
				<span className="justify-self-end overflow-hidden text-ellipsis whitespace-nowrap text-nowrap text-xl font-semibold text-muted-foreground">
					{product.category.name}
				</span>
				<Price
					className="text-2xl"
					discount={product.discount}
					price={product.price}
				/>
				<Controls {...product} />
			</main>
			{show &&
				<LocalModal isOpen={show} close={() => setShow(false)}>
					<DetailedProduct {...product} />
				</LocalModal>
			}
		</article>
	);
});

function Controls(product: Props) {
	const session = useSession();
	const [show, setShow] = React.useState(false)
	const dispatcher = useAppDispatch()

	const saved = useAppSelector(s => s.saved.saved.includes(product.id))

	return (
		<div className="flex items-center justify-end gap-2">
			<BuyButton
				className="w-full text-2xl self-center justify-self-center"
				id={product.id}
			/>
			{session.data?.user?.role === "admin" ? (
				<button
					type="button"
					className={`ml-auto flex appearance-none justify-between bg-transparent p-0 hover:bg-transparent`}
					onClick={() => setShow(true)}
				>
					<Edit
						className="*:fill-foreground *:stroke-foreground"
						width={"30px"}
						height={"30px"}
					/>
				</button>
			) : (
				<button
					type="button"
					className="group appearance-none justify-self-end bg-transparent p-0 hover:bg-transparent"
					title={saved ? "Del from Favourite" : "Add to Favoutite"}
					onClick={async () => {
						if (!session.data?.user) {
							error({
								error: "You have to authenticate to save products",
								title: "Not Authorized"
							})
						} else await dispatcher(toggleSaved(product.id))
					}
					}
				>
					<Heart
						className={`*:stroke-card-foreground *:stroke-1 ${saved
							? "fill-accent"
							: "fill-transparent group-hover:fill-accent/70"
							}
				`}
						width={"30px"}
						height={"30px"}
					/>
				</button>
			)
			}
			{show &&
				<LocalModal isOpen={show} close={() => setShow(false)}>
					<div onSubmit={() => (product.reload(product.id), setShow(false))}>
						<ProductForm product={product} />
					</div>
				</LocalModal>
			}
		</div >
	);
}

export default ProductCard;
