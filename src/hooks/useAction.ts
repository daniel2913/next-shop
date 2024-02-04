import React from "react";
import useToast from "./modals/useToast";

export type ServerErrorType = {error:string, title:string}

export default function useAction<T>(func:()=>Promise<T|ServerErrorType>,init:T){
	const [value,setValue] = React.useState(init)
	const {handleResponse} = useToast()
	const [_,set] = React.useState(0)
	React.useEffect(()=>{
		async function execute(){
			const res = (await func())
			if (handleResponse(res)!==null)
				setValue(res as T)
		}
		execute()
	},[_])
	return {value,setValue,reload:()=>set(s=>++s)}
}
