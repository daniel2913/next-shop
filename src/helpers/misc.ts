import { Column, bindIfParam, sql } from "drizzle-orm"

export function toArray<T>(inp: T | T[]) {
	if (Array.isArray(inp)) return inp
	return [inp]
}

export function deffer<T extends (...args: any) => any>(func: T, delay = 5000) {
	let timeout: NodeJS.Timeout
	return function deffered(inst: boolean, ...args: Parameters<T>) {
		if (timeout) clearTimeout(timeout)
		if (inst) func.apply(null, args)
		else timeout = setTimeout(() => func.apply(null, args), delay)
	}
}

export function betterInArray(column: Column, values: any[]) {
	if (Array.isArray(values)) {
		if (values.length === 0) {
			return sql`0=1`
		}
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`
	}
	return sql`${column} in ${bindIfParam(values, column)}`
}
export default function calcPrice(price: number, discount?: number) {
	return Number((price - (price * (discount || 0)) / 100).toFixed(2))
}
