"use client";

import type { Category } from "@/lib/Models";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "@/components//ui/Button";
import Edit from "@public/edit.svg";
import DiscountForm from "@/components/forms/DiscountForm";
import CategoryForm from "@/components/forms/CategoryForm";
import { deleteCategoriesAction } from "@/actions/category";
import GenericSelectTable from "@/components/ui/GenericSelectTable";
import { useToastStore } from "@/store/ToastStore";
import { ModalContext } from "@/providers/ModalProvider";

type Props = {
	categories: Category[];
	className?: string;
};

export default function CategoriesAdmin({ categories, className }: Props) {
	const [selected, setSelected] = React.useState<number[]>([]);
	const [loading, setLoading] = React.useState(false);
	const show = React.useContext(ModalContext)
	const isValidResponse = useToastStore((s) => s.isValidResponse);
	const router = useRouter();
	const onChange = (ids: number[]) => setSelected(ids);
	return (
		<div className={`${className} flex flex-col`}>
			<div className="flex gap-4">
				<Button
					onClick={() => {
						show({
							title: "Create Category",
							children: () => <CategoryForm />
						}).then(router.refresh);
					}}
				>
					Create
				</Button>
				<Button
					disabled={loading || selected.length === 0}
					onClick={async () => {
						setLoading(true);
						const res = await deleteCategoriesAction(selected);
						if (isValidResponse(res)) {
							setSelected([]);
							router.refresh();
						}
						setLoading(false);
					}}
				>
					Delete
				</Button>
				<Button
					disabled={selected.length === 0}
					onClick={() => {
						show({
							title: "Category Discount",
							children: () => <DiscountForm discount={{ categories: selected }} />
						}).then(() => setSelected([]));
					}}
				>
					Discount
				</Button>
			</div>
			<GenericSelectTable
				items={categories}
				value={selected}
				onChange={onChange}
				columns={{
					Id: (s) => s.id,
					Name: (s) => s.name,
					Edit: (s) => (
						<Button
							onClick={() =>
								show({
									title: "Edit Category",
									children: () => <CategoryForm category={s} />
								}).then(() => router.refresh())
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
