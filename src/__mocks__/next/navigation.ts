
export function useRouter(){
	return({
		replace:(path:string)=>console.log(`Router Replace ${path}`),
		push:(path:string)=>console.log(`Router Push ${path}`),
		refresh:()=>console.log(`Router Refresh`),
		back:()=>console.log(`Router Back`),
		forward:()=>console.log(`Router Forward`),
		prefetch:(path:string)=>console.log(`Router Prefetch ${path}`),
	})
}
