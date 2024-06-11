"use client";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/Table";

type GenericProps<T extends (Record<string, unknown> & { id: number })[]> = {
	value: number[];
	onChange: (val: number[]) => void;
	name?: string;
	items: T;
	columns: Record<string, (s: T[number]) => T[number][string]>;
};

export default function GenericSelectTable<
	T extends (Record<string, unknown> & { id: number })[],
>(props: GenericProps<T>) {
	function onClick(id: number) {
		if (props.value.includes(id))
			props.onChange(props.value.filter((old) => old !== id));
		else props.onChange([...props.value, id]);
	}
	function onGroupClick() {
		const newState = props.value.filter((old) =>
			props.items.every((prod) => prod.id !== old),
		);
		if (
			props.items.map((item) => item.id).every((id) => props.value.includes(id))
		)
			props.onChange(newState);
		else props.onChange(newState.concat(props.items.map((item) => item.id)));
	}
	const columnNames = Object.keys(props.columns);
	return (
		<Table>
			<TableHeader>
				<TableRow className="*:text-center *:text-foreground">
					<TableHead>
						<input
							type="checkbox"
							onChange={onGroupClick}
							checked={props.items
								.map((item) => item.id)
								.every((id) => props.value.includes(id))}
						/>
					</TableHead>
					{columnNames.map((col, idx) => (
						<TableHead key={`${col}-${idx}`}>{col}</TableHead>
					))}
				</TableRow>
			</TableHeader>
			<TableBody>
				{props.items.map((item) => (
					<TableRow
						key={`${item.id}`}
						onClick={() => onClick(item.id)}
						className="cursor-pointer text-center bg-blend-lighten *:text-center *:text-foreground *:hover:bg-white/40"
					>
						<TableCell>
							<input
								type="checkbox"
								value={item.id}
								name={props.name}
								onChange={() => onClick(item.id)}
								checked={props.value.includes(item.id)}
							/>
						</TableCell>
						{columnNames.map((col, idx) =>
							<TableCell key={`${col}-${idx}`}>
								<div className="flex justify-center">
								{props.columns[col](item)}
								</div>
							</TableCell>
						)}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
