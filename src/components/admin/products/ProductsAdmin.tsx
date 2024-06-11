"use client";

import type { PopulatedProduct } from "@/lib/Models/Product";
import ProductsAdminTabs from "./ProductsAdminTabs";
import React from "react";
import { Button } from "@/components/ui/Button";
import { deleteProductsAction } from "@/actions/product";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/forms/ProductForm";
import DiscountForm from "@/components/forms/DiscountForm";
import { createRandomProductAction } from "@/actions/generate";
import { ModalContext } from "@/providers/ModalProvider";
import useConfirm from "@/hooks/modals/useConfirm";
import { actions, useAppDispatch } from "@/store/rtk";
import { cleanUp } from "@/helpers/cleanUp";
import { error, toast } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";

type Props = {
	products: PopulatedProduct[];
	className?: string;
};

export default function ProductsAdmin({ products, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([]);
	const [loading, setLoading] = React.useState(false);
	const dispatch = useAppDispatch()
	const show = React.useContext(ModalContext)
	const confirm = useConfirm()
	const router = useRouter();
	const onChange = (ids: number[]) => setSelected(ids);
	return (
		<div className={`${className} flex flex-col gap-2`}>
			<div className="flex gap-4">
				<Button
					onClick={() => {
						show({
							title: "Create Product",
							children: () => <ProductForm />
						}).then(router.refresh);
					}}
				>
					Create
				</Button>
				<Button
					onClick={async () => {
						const product = await createRandomProductAction();
						if (!product) {
							error({ error: "Something went wrong", title: "Server Error" });
							return
						}
						toast({
							type: "background",
							title: "Success",
							description: `${product.name}`,
							action: <Button onClick={() => show({ title: "", children: () => <ProductForm product={product} /> })}>Edit</Button>
						})
						router.refresh();
					}}
				>
					Add Random
				</Button>
				<Button
					disabled={loading}
					onClick={async () => {
						setLoading(true);
						const ans = await confirm(`Are you sure you want to delte ${selected.length} items?`, "Delete Items")
						if (!ans) return
						const res = await deleteProductsAction(selected);
						if (isValidResponse(res)) {
							setSelected([]);
							router.refresh();
						} else error(res)
						setLoading(false);
					}}
				>
					Delete
				</Button>
				<Button
					disabled={selected.length === 0}
					onClick={() => {
						show({
							title: "Product Discount",
							children: () => <DiscountForm discount={{ products: selected }} />
						}).then(() => setSelected([]));
					}}
				>
					Discount
				</Button>
				<Button
					onClick={() => cleanUp().then(r => toast({ title: "Success", description: `${r} items deleted` }))}>
					Delete unused images
				</Button>
			</div >
			<ProductsAdminTabs
				config
				products={products}
				value={selected}
				onChange={onChange}
			/>
		</div >
	);
}
