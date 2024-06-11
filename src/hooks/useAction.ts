import { error } from "@/components/ui/use-toast";
import { isValidResponse } from "@/helpers/misc";
import React from "react";

export type ServerErrorType = { error: string; title: string };

export default function useAction<T>(
	func: () => Promise<T | ServerErrorType>,
	init: T,
) {
	const [value, setValue] = React.useState(init);
	const [loading, setLoading] = React.useState(true);
	const [_, set] = React.useState(0);
	React.useEffect(() => {
		async function execute() {
			setLoading(true);
			const res = await func();
			setLoading(false);
			if (isValidResponse(res)) setValue(res);
			else error(res)
		}
		execute();
	}, [_]);
	return { value, setValue, loading, reload: () => set((s) => ++s) };
}
