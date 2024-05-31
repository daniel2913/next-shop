"use client";
import Form from "./common.tsx";
import React from "react";
import { changeDiscountAction, createDiscountAction } from "@/actions/discount";
import { Slider } from "../ui/Slider.tsx";
import { Label } from "../ui/Label.tsx";
import Input from "../ui/Input.tsx";

const validation = {
	discount: (discount: number) => {
		if (discount < 1) return "Greater than 0";
		if (discount > 99) return "Less than 100";
		if (Number.isInteger(discount)) return "Only integers";
		return false;
	},
};

type Props = {
	discount?: Partial<{
		id: number;
		discount: number;
		brands: number[];
		categories: number[];
		products: number[];
		expires: Date;
	}>;
};

export default function DiscountForm({ discount }: Props) {
	const action =
		discount?.id !== undefined
			? (form: FormData) => changeDiscountAction(discount.id!, form)
			: createDiscountAction;
	const [value, setValue] = React.useState(discount?.discount || 50);
	const [expires, setExpires] = React.useState(
		discount?.expires?.toJSON().slice(0, 10) ||
			new Date(Date.now() + 1000 * 60 * 60 * 24).toJSON().slice(0, 10),
	);

	return (
		<Form validations={validation} className="" action={action}>
			<span>
				{`Discount will affect:\n`}
				{(discount?.products?.length || "") &&
					`${discount?.products?.length} products`}
				{(discount?.brands?.length || "") &&
					`${discount?.brands?.length} brands`}
				{(discount?.categories?.length || "") &&
					`${discount?.categories?.length} categories`}
			</span>
			<Label className="w-full">
				Discount
				<Slider
					className="w-full py-1"
					value={[value]}
					onValueChange={(e) => setValue(Math.floor(e[0]))}
					max={99}
					min={1}
					title="Discount"
					name="discount"
				/>
				<span className="w-full text-center">{value}</span>
			</Label>
			<Label>
				Expires
				<Input
					name="expires"
					type="datetime-local"
					value={expires}
					onChange={(e) => setExpires(e.currentTarget.value)}
				/>
			</Label>
			{(discount?.products || []).map((product) => (
				<input
					key={product}
					type="checkbox"
					checked
					name="products"
					value={product}
					hidden
					readOnly
				/>
			))}
			{(discount?.brands || []).map((brand) => (
				<input
					key={brand}
					type="checkbox"
					checked
					name="brands"
					value={brand}
					hidden
					readOnly
				/>
			))}
			{(discount?.categories || []).map((category) => (
				<input
					key={category}
					type="checkbox"
					checked
					name="categories"
					value={category}
					hidden
					readOnly
				/>
			))}
		</Form>
	);
}
