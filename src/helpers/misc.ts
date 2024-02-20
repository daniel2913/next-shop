export function toArray<T>(inp:T|T[]){
	if (Array.isArray(inp)) return inp
	return [inp]
}

export function deffer<T extends (args: any) => any>(func: T, delay = 5000) {
	let timeout:NodeJS.Timeout
	return function deffered(inst:boolean,...args: Parameters<T>) {
			if (timeout)
				clearTimeout(timeout)
			if (inst)
				func.apply(null,args)		
			else
				timeout = setTimeout(()=>func.apply(null,args),delay)
		}
}
