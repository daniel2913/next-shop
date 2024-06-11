import React from "react";
import type { PopulatedProduct } from "@/lib/Models/Product";
import type { ServerErrorType } from "./useAction";
import { error } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";

type ItemsProps<T extends { id: number }> = {
	initItems?: T[];
	getItems: (ids: number[]) => Promise<T[] | ServerErrorType>;
};

export function useItemsController<T extends { id: number }>(
	props: ItemsProps<T>,
) {
	const [items, setItems] = React.useState(props.initItems || []);
	const [loading, setLoading] = React.useState(false);

	const reload = React.useCallback(async () => {
		setLoading(true);
		const oldIds = items.map((prod) => prod.id);
		const newItems = await props.getItems(oldIds);
		if (!isValidResponse(newItems)) {
			error(newItems)
			return
		};
		const newIds = newItems.map((prod) => prod.id);
		const persisted = oldIds.filter((id) => newIds.includes(id));
		setItems(
			persisted.map((prod) => newItems.find((newProd) => newProd.id === prod)!),
		);
		setLoading(false);
	}, [items, props.getItems]);

	const reloadOne = React.useCallback(
		async (id: number) => {
			const newItem = await props.getItems([id]);
			if (!isValidResponse(newItem)) {
				error(newItem)
				return;
			}
			setItems((products) => {
				const idx = products.findIndex((prod) => prod.id === id);
				return products.with(idx, newItem[0]);
			});
		},
		[ props.getItems],
	);

	const updateOne = React.useCallback(
		async (id: number, part: Partial<PopulatedProduct>) => {
			setItems((items) => {
				const idx = items.findIndex((prod) => prod.id === id);
				if (idx === -1) return items;
				return items.with(idx, { ...items[idx], ...part });
			});
		},
		[],
	);

	return { items, loading, setLoading, setItems, reload, reloadOne, updateOne };
}
