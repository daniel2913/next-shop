export function toArray<T>(inp:T|T[]){
	if (Array.isArray(inp)) return inp
	return [inp]
}
