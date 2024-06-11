import type { ServerErrorType } from "@/hooks/useAction";

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

export function calcDiscount(price: number, discount?: number) {
	const res = discount
		? price - (price * discount / 100)
		: price
	return +(res/100).toFixed(2)

}
export function formatPrice(price: number) {
	const res = price.toString()
	return res
}

export function parseFormData(formData: FormData) {
	const object: Record<string, unknown> = {};
	for (const [key, value] of formData.entries()) {
		if (key in object) {
			if (Array.isArray(object[key])) (object[key] as unknown[]).push(value);
			else object[key] = [object[key], value];
		} else object[key] = value;
	}
	return object;
}

export function isValidResponse<T>(resp: T | ServerErrorType): resp is T {
	if (resp && typeof resp === "object" && "error" in resp) {
		return false;
	}
	return true;
}
