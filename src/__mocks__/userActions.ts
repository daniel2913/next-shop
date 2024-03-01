let nextJson
export async function registerUserAction(username:string,password:string){
	if (nextJson)
		return{json:()=>nextJson}
	console.log(username,password)
	return true
}

export function decorator(story, { parameters }) {
if (parameters && parameters.fetch) {
	nextJson = parameters.fetch.json;
}
return story();
}
