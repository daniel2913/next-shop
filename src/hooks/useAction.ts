import React from "react";

export default function useOptions<T extends Promise<Array<any>>>(func:()=>T){
	const [value,setValue] = React.useState<Awaited<T>>()
	React.useEffect(()=>{
		async function execute(){
			const res = await func()
			console.log(res)
			setValue(res)
		}
		execute()
	},[])
	return value
}
