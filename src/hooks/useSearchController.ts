import React from "react";
import { useSearchParams } from "next/navigation";
import type { ServerErrorType } from "./useAction";
import { error } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";

export function useSearchController<T extends { id: number }>(
	props: SearchProps<T>,
) {
	const searchParams = useSearchParams();
	const oldParams = React.useRef(searchParams);

	React.useEffect(() => {
		async function reloadProducts() {
			props.setLoading?.(true);
			const newItems = await props.query(searchParams, 0, props.page || 20);
			if (!isValidResponse(newItems)) {
				error(newItems)
				return;
			}
			props.setItems(newItems || []);
			props.setLoading?.(false);
		}
		if (searchParams === oldParams.current) return;
		oldParams.current = searchParams;
		reloadProducts();
	}, [searchParams]);
	return searchParams;
}
type SearchProps<T extends { id: number }> = {
	query: (
		params: URLSearchParams,
		start: number,
		end: number,
	) => Promise<T[] | ServerErrorType>;
	setItems: (val: T[]) => void;
	setLoading?: (val: boolean) => void;
	page?: number;
};
