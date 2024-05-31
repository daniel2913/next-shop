import { type Column, bindIfParam, sql } from "drizzle-orm";

export function toArray<T>(inp: T | T[]) {
	if (Array.isArray(inp)) return inp;
	return [inp];
}

export function deffer<T extends unknown, A extends unknown[]>(func: (...args: A) => T, delay = 5000) {
	let timeout: Timer;
	let promise: Promise<T>
	let resolve: (val: T) => void
	let reject: (val: unknown) => void
	function deffered(inst: boolean, ...args: A) {
		if (!timeout) {
			promise = new Promise((res, rej) => { resolve = res; reject = rej })
		}
		if (timeout) clearTimeout(timeout);
		if (inst) resolve(func(...args));
		else timeout = setTimeout(() => resolve(func(...args)), delay);
		return promise
	};
	return deffered
}


export function betterInArray(column: Column, values: any[]) {
	if (Array.isArray(values)) {
		if (values.length === 0) {
			return sql`0=1`;
		}
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} in ${bindIfParam(values, column)}`;
}

const dseparator = (1.1).toLocaleString().slice(1, 2)

export default function calcPrice(price: number, discount?: number) {
	const res = ((price - (price * (discount || 0)) / 100)).toString();
	return (res.slice(0, -2) || "0") + dseparator + res.slice(-2)
}

