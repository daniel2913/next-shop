export function resolveCartConflict(remoteCart?: Record<number, number>, localCart?: Record<number, number>) {

	if (!localCart || compareCarts(localCart, {})) return

	if (!remoteCart || compareCarts(remoteCart, {})) {
		return localCart;
	}
	if (compareCarts(remoteCart, localCart)) {
		return
	}
	return {
		remoteCart,
		localCart,
		mergedCarts: mergeCarts(remoteCart, localCart)
	} as const
}

export function compareCarts(cart1: Record<number, number>, cart2: Record<number, number>) {
	//if (Object.keys(cart1).length !== Object.keys(cart2).length) return false

	for (const [id, num] of Object.entries(cart1)) {
		if (!num && !cart2[+id]) continue
		if (cart2[+id] !== num) return false
	}
	for (const [id, num] of Object.entries(cart2)) {
		if (!num && !cart1[+id]) continue
		if (cart1[+id] !== num) return false
	}
	return true
}

export function mergeCarts(cart1: Record<number, number>, cart2: Record<number, number>) {
	const result = structuredClone(cart1);
	const included = Object.keys(result);
	for (const [id, amount] of Object.entries(cart2)) {
		if (included.includes(id)) result[+id] = result[+id] + amount;
		else result[+id] = amount;
	}
	return result;
}
