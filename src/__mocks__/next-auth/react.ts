let signResult
export async function signIn(variant:string,options){
	console.log(variant,options)
	return signResult || true
}

let sessionProps
export function useSession(){
	return {
		update:()=>console.log("Session update"),
		status:sessionProps.status||"test",
		data:{
			expires:sessionProps.data.expires||"",
			user:{
				name:sessionProps.data.user.name||"test",
				role:sessionProps.data.user.role||"user",
				id:sessionProps.data.user.id||1,
			}
		}
	}
}


export function decorator(story, { parameters }) {
	signResult = parameters.signResult;
	sessionProps = parameters.sessionProps
return story();
}
