import React from "react";
export default function useAction<T extends Promise<any>>(func:()=>T,init:Awaited<T>){
	const [value,setValue] = React.useState<Awaited<T>>(init)
	const [_,set] = React.useState(0)
	React.useEffect(()=>{
		async function execute(){
			console.log("Reloading")
			const res = await func()
			setValue(res)
		}
		execute()
	},[_])
	return {value,setValue,reload:()=>set(s=>++s)}
}
