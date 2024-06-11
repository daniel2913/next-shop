"use client";

import type { Discount } from "@/lib/Models";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import Edit from "@public/edit.svg";
import { deleteDiscountsAction } from "@/actions/discount";
import DiscountForm from "@/components/forms/DiscountForm";
import GenericSelectTable from "@/components/ui/GenericSelectTable";
import { ModalContext } from "@/providers/ModalProvider";

type Props = {
	discounts: Discount[];
	className?: string;
};

export default function DiscountsAdmin({ discounts, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([]);
	const [loading, setLoading] = React.useState(false);
	const show = React.useContext(ModalContext)
	const router = useRouter();
	const onChange = (ids: number[]) => setSelected(ids);
	return (
		<div className={`${className} flex flex-col`}>
			<div className="flex gap-4">
				<Button
					disabled={loading || selected.length === 0}
					onClick={async () => {
						setLoading(true);
						await deleteDiscountsAction(selected);
						setSelected([]);
						router.refresh();
						setLoading(false);
					}}
				>
					Delete
				</Button>
			</div>
			<GenericSelectTable
				items={discounts}
				value={selected}
				onChange={onChange}
				columns={{
					Id: (s) => s.id,
					Discount: (s) => s.discount,
					Products: (s) => s.products.length,
					Brands: (s) => s.brands.length,
					Categories: (s) => s.categories.length,
					Expires: (s) =>
						+s.expires > Date.now() ? s.expires.toUTCString() : "Expired",
					Edit: (s) => (
						<Button
							onClick={() =>
								show({
									title: "Edit Discount",
									children: () => <DiscountForm discount={s} />
								}).then(router.refresh)
							}
							className="appearance-none bg-transparent hover:bg-transparent"
						>
							<Edit width={30} height={30} />
						</Button>
					),
				}}
			/>
		</div>
	);
}
